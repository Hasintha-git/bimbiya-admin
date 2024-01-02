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

@Component({
  selector: 'app-approved-order',
  templateUrl: './approved-order.component.html',
  styleUrls: ['./approved-order.component.scss']
})
export class ApprovedOrderComponent implements OnInit, AfterViewInit, OnDestroy {
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

  displayedColumns: string[] = ['view', 'orderId', 'userId', 'orderDate', 'totalAmount', 'action'];

  constructor(
    public dialog: MatDialog,
    public toast: ToastServiceService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonFunctionService: CommonFunctionService
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
    this.orderService.getSearchData(true)
      .subscribe((response: any) => {
        this.statusList = response.statusList;
      },
      error => {
        this.toast.errorMessage(error.error['message']);
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
    this.orderService.getList(searchParamMap)
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
        this.toast.errorMessage(error.error['errorDescription']);
      }
    );
  }

  getSearchString(searchParamMap: Map<string, any>, searchModel: OrderResponse): Map<string, string> {
    if (searchModel.userId) {
      searchParamMap.set("userId", searchModel.userId);
    }
    searchParamMap.set("status", "approved");

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

  resetSearch() {
    this.userSearch.reset();
    this.initialDataLoader();
  }


  view(id: any) {
    // const dialogRef = this.dialog.open(ViewUserComponent, { data: id });
    // dialogRef.afterClosed().subscribe(result => {
    // });
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
