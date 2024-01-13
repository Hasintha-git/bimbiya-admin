import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/services/common-functions/common-function.service';
import {  PAGE_LENGTH } from 'src/app/utility/constants/system-config';
import { merge, tap } from 'rxjs';
import { Commondatasource } from '../../datasource/Commondatasource';
import { DataTable } from '../../models/data-table';
import { OrderResponse } from 'src/app/models/response/order-response';
import { OrderService } from 'src/app/services/order/order.service';
import { ViewOrderComponent } from '../approved-order/view-order/view-order.component';
import { Order } from 'src/app/models/order';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { OrderStatusChangeComponent } from '../../component/order-status-change/order-status-change.component';
import { StorageService } from 'src/app/models/StorageService';
@Component({
  selector: 'app-pending-order',
  templateUrl: './pending-order.component.html',
  styleUrls: ['./pending-order.component.scss']
})
export class PendingOrderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public userSearch: FormGroup;
  public dataSourceUser: Commondatasource;
  public orderList: OrderResponse[];
  public searchModel: OrderResponse;
  public statusList: SimpleBase[];
  public searchReferenceData: Map<string, Object[]>;
  public isSearch: boolean;
  public access: any;  
  orderModelAdd = new Order();

  displayedColumns: string[] = ['view', 'orderId', 'userId', 'orderDate', 'totalAmount', 'action'];

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private spinner: NgxSpinnerService,
    private orderService: OrderService,
    public toastService: ToastServiceService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonFunctionService: CommonFunctionService,
    private sessionStorage: StorageService,
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.searchModel = new OrderResponse();
    this.prepareReferenceData();
    this.initialForm();
    this.initialDataLoader();
  }

  initialForm() {
    this.userSearch = this.formBuilder.group({
      userId: new FormControl(''),
      orderDate: new FormControl(''),
    });
  }

  prepareReferenceData(): void {
    console.log(this.sessionStorage.getItem('session'))
    const token = this.sessionStorage.getItem('session');
    this.orderService.getSearchData(true,token)
      .subscribe((response: any) => {
        this.statusList = response.statusList;
      },
      error => {
        this.toastService.errorMessage(error.error['message']);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSourceUser.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        tap(() => this.getList())
      )
      .subscribe();
  }

  initialDataLoader(): void {
    this.initialDataTable();
    this.dataSourceUser = new Commondatasource();
    this.dataSourceUser.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
    this.getList();
  }

  getList() {
    let searchParamMap = this.commonFunctionService.getDataTableParam(this.paginator, this.sort);
    searchParamMap = this.getSearchString(searchParamMap, this.searchModel);
    const token = sessionStorage.getItem('session');
    this.orderService.getList(searchParamMap,token)
      .subscribe((data: DataTable<OrderResponse>) => {
        this.orderList = data.records;
        console.log("---->",this.orderList)
        this.dataSourceUser.datalist = this.orderList;
        console.log(this.dataSourceUser)
        this.dataSourceUser.usersSubject.next(this.orderList);
        this.dataSourceUser.countSubject.next(data.totalRecords);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastService.errorMessage(error.error['errorDescription']);
      }
    );
  }

  orderStatusChange(orderId:any,status:any ) {
    const dialogRef = this.dialog.open(OrderStatusChangeComponent, {data: orderId});
    dialogRef.componentInstance.orderStatus = status;
    dialogRef.afterClosed().subscribe(result => {
      this.initialDataLoader();
    });
  }

  getSearchString(searchParamMap: Map<string, any>, searchModel: OrderResponse): Map<string, string> {
    if (searchModel.userId) {
      searchParamMap.set("userId", searchModel.userId);
    }
    searchParamMap.set("status", "pending");

    if (searchModel.orderDate) {
      searchParamMap.set("orderDate", searchModel.orderDate.toLocaleDateString());
    }
    return searchParamMap;
  }

  initialDataTable() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = PAGE_LENGTH;
  }

  search(search: boolean) {
    this.isSearch = search;
    this.initialDataLoader();
  }

  view(id: any) {
    console.log(id)
    const dialogRef = this.dialog.open(ViewOrderComponent, { data: id });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  resetSearch() {
    this.userSearch.reset();
    this.initialDataLoader();
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  // Getters for form controls
  get userId() {
    return this.userSearch.get('userId');
  }

  get status() {
    return this.userSearch.get('status');
  }

  get orderDate() {
    return this.userSearch.get('orderDate');
  }
}
