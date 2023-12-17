import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { User } from 'src/app/models/user';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/services/common-functions/common-function.service';
import { LAST_UPDATED_TIME, PAGE_LENGTH, SORT_DIRECTION } from 'src/app/utility/constants/system-config';
import { merge, tap } from 'rxjs';
import { Commondatasource } from 'src/app/pages/datasource/Commondatasource';
import { DataTable } from 'src/app/pages/models/data-table';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ByteService } from 'src/app/services/byte/byte.service';
import { Bite } from 'src/app/models/bite';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public biteSearch: FormGroup;
  public dataSource: Commondatasource;
  public biteList: Bite[];
  public searchModel: Bite;
  public statusList: SimpleBase[];
  public portionList: SimpleBase[];
  public ingredientsList: SimpleBase[];
  public searchReferenceData: Map<string, Object[]>;
  public isSearch: boolean;
  public access: any;

  displayedColumns: string[] = ['view', 'mealName', 'description', 'price', 'status','action'];

  constructor(
    public dialog: MatDialog,
    public toast: ToastServiceService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private byteService: ByteService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonFunctionService: CommonFunctionService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.searchModel = new Bite();
    this.prepareReferenceData();
    this.initialForm();
    this.initialDataLoader();
  }

  initialForm() {
    this.biteSearch = this.formBuilder.group({
      mealName: new FormControl(''),
      price: new FormControl(''),
      status: new FormControl(''),
      portion: new FormControl('')
    });
  }

  prepareReferenceData(): void {
    this.byteService.getSearchData(true)
      .subscribe((response: any) => {
        this.statusList = response.statusList;
        this.portionList = response.portionList;
        this.ingredientsList = response.ingredientsList;
      },
      error => {
        this.toast.errorMessage(error.error['message']);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.counter$
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
    this.dataSource = new Commondatasource();
    this.dataSource.counter$
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
    if (this.isSearch) {
      searchParamMap = this.getSearchString(searchParamMap, this.searchModel);
    }
    this.byteService.getList(searchParamMap)
      .subscribe((data: DataTable<Bite>) => {
        this.biteList = data.records;
        console.log("---->",this.biteList)
        this.dataSource.datalist = this.biteList;
        console.log(this.dataSource)
        this.dataSource.usersSubject.next(this.biteList);
        this.dataSource.countSubject.next(data.totalRecords);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toast.errorMessage(error.error['errorDescription']);
      }
    );
  }

  getSearchString(searchParamMap: Map<string, any>, searchModel: Bite): Map<string, string> {
    if (searchModel.mealName) {
      searchParamMap.set("mealName", searchModel.mealName);
    }
    if (searchModel.price) {
      searchParamMap.set("price", searchModel.price);
    }
    if (searchModel.status) {
      searchParamMap.set("status", searchModel.status);
    }
    if (searchModel.portion) {
      searchParamMap.set("portion", searchModel.portion);
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

  reset() {
    this.biteSearch.reset();
    this.initialDataLoader();
  }

  add() {
    const dialogRef = this.dialog.open(AddProductComponent);
    dialogRef.componentInstance.statusList = this.statusList;
    dialogRef.componentInstance.portionList = this.portionList;
    dialogRef.componentInstance.ingredientsList = this.ingredientsList;
    dialogRef.afterClosed().subscribe(result => {
      this.reset();
    });
  }

  edit(id: any) {
    const dialogRef = this.dialog.open(EditProductComponent, { data: id });
    dialogRef.componentInstance.statusList = this.statusList;
    dialogRef.componentInstance.portionList = this.portionList;
    dialogRef.componentInstance.ingredientsList = this.ingredientsList;
    dialogRef.afterClosed().subscribe(result => {
      this.reset();
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(DeleteProductComponent, { data: id, width: '350px', height: '180px' });

    dialogRef.afterClosed().subscribe(result => {
      this.reset();
    });
  }

  view(id: any) {
    const dialogRef = this.dialog.open(ViewProductComponent, { data: id });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  // Getters for form controls
  get mealName() {
    return this.biteSearch.get('mealName');
  }

  get price() {
    return this.biteSearch.get('price');
  }

  get status() {
    return this.biteSearch.get('status');
  }

  get portion() {
    return this.biteSearch.get('portion');
  }
}

