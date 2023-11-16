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

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  public userSearch: FormGroup;
  public dataSourceUser: Commondatasource;
  public userList: User[];
  public searchModel: User;
  public statusList: SimpleBase[];
  public userRoleList: SimpleBase[];
  public searchReferenceData: Map<string, Object[]>;
  public isSearch: boolean;
  public access: any;

  displayedColumns: string[] = ['view', 'mealName', 'description', 'price', 'portion', 'status','action'];

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
    this.searchModel = new User();
    this.prepareReferenceData();
    this.initialForm();
    this.initialDataLoader();
  }

  initialForm() {
    this.userSearch = this.formBuilder.group({
      mealName: new FormControl(''),
      price: new FormControl(''),
      status: new FormControl('')
    });
  }

  prepareReferenceData(): void {
    this.byteService.getSearchData(true)
      .subscribe((response: any) => {
        this.statusList = response.statusList;
        this.userRoleList = response.userRoleList;
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
    if (this.isSearch) {
      searchParamMap = this.getSearchString(searchParamMap, this.searchModel);
    }
    this.byteService.getList(searchParamMap)
      .subscribe((data: DataTable<User>) => {
        this.userList = data.records;
        console.log("---->",this.userList)
        this.dataSourceUser.datalist = this.userList;
        console.log(this.dataSourceUser)
        this.dataSourceUser.usersSubject.next(this.userList);
        this.dataSourceUser.countSubject.next(data.totalRecords);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toast.errorMessage(error.error['errorDescription']);
      }
    );
  }

  getSearchString(searchParamMap: Map<string, any>, searchModel: User): Map<string, string> {
    if (searchModel.username) {
      searchParamMap.set(this.displayedColumns[1].toString(), searchModel.username);
    }
    if (searchModel.nic) {
      searchParamMap.set(this.displayedColumns[4].toString(), searchModel.nic);
    }
    if (searchModel.userRole) {
      searchParamMap.set(this.displayedColumns[3].toString(), searchModel.userRole);
    }
    if (searchModel.status) {
      searchParamMap.set(this.displayedColumns[7].toString(), searchModel.status);
    }
    if (searchModel.email) {
      searchParamMap.set(this.displayedColumns[5].toString(), searchModel.email);
    }
    if (searchModel.mobileNo) {
      searchParamMap.set(this.displayedColumns[6].toString(), searchModel.mobileNo);
    }
    return searchParamMap;
  }

  initialDataTable() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = PAGE_LENGTH;
  }

  searchUser(search: boolean) {
    this.isSearch = search;
    this.initialDataLoader();
  }

  resetUserSearch() {
    this.userSearch.reset();
    this.initialDataLoader();
  }

  add() {
    const dialogRef = this.dialog.open(AddProductComponent);
    dialogRef.componentInstance.statusList = this.statusList;
    dialogRef.componentInstance.userRoleList = this.userRoleList;
    dialogRef.afterClosed().subscribe(result => {
      this.resetUserSearch();
    });
  }

  edit(id: any) {
    const dialogRef = this.dialog.open(EditProductComponent, { data: id });
    dialogRef.componentInstance.statusList = this.statusList;
    dialogRef.componentInstance.userRoleList = this.userRoleList;
    dialogRef.afterClosed().subscribe(result => {
      this.resetUserSearch();
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(DeleteProductComponent, { data: id, width: '350px', height: '180px' });

    dialogRef.afterClosed().subscribe(result => {
      this.resetUserSearch();
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
  get username() {
    return this.userSearch.get('username');
  }

  get fullName() {
    return this.userSearch.get('fullName');
  }

  get status() {
    return this.userSearch.get('status');
  }

  get userRole() {
    return this.userSearch.get('userRole');
  }

  get nic() {
    return this.userSearch.get('nic');
  }

  get email() {
    return this.userSearch.get('email');
  }

  get mobileNo() {
    return this.userSearch.get('mobileNo');
  }
}

