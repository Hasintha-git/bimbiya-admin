import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionService } from 'src/app/services/common-functions/common-function.service';
import { PAGE_LENGTH } from 'src/app/utility/constants/system-config';
import { merge, tap } from 'rxjs';
import { Commondatasource } from 'src/app/pages/datasource/Commondatasource';
import { DataTable } from 'src/app/pages/models/data-table';
import { ViewIngredientComponent } from './view-ingredient/view-ingredient.component';
import { DeleteIngredientComponent } from './delete-ingredient/delete-ingredient.component';
import { UpdateIngredientComponent } from './update-ingredient/update-ingredient.component';
import { AddIngredientComponent } from './add-ingredient/add-ingredient.component';
import { Ingredient } from 'src/app/models/ingredient';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';

@Component({
  selector: 'app-ingredient-management',
  templateUrl: './ingredient-management.component.html',
  styleUrls: ['./ingredient-management.component.scss']
})
export class IngredientManagementComponent implements OnInit,AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public biteSearch: FormGroup;
  public dataSource: Commondatasource;
  public biteList: Ingredient[];
  public searchModel: Ingredient;
  public statusList: SimpleBase[];
  public portionList: SimpleBase[];
  public ingredientsList: SimpleBase[];
  public searchReferenceData: Map<string, Object[]>;
  public isSearch: boolean;
  public access: any;

  displayedColumns: string[] = ['view', 'ingredientsName', 'status','lastUpdatedUser','lastUpdatedTime','action'];

  constructor(
    public dialog: MatDialog,
    public toast: ToastServiceService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private ingredientService: IngredientService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonFunctionService: CommonFunctionService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.searchModel = new Ingredient();
    this.prepareReferenceData();
    this.initialForm();
    this.initialDataLoader();
  }

  initialForm() {
    this.biteSearch = this.formBuilder.group({
      ingredientsName: new FormControl(''),
      status: new FormControl(''),
    });
  }

  prepareReferenceData(): void {
    this.ingredientService.getSearchData(true)
      .subscribe((response: any) => {
          this.statusList = response.statusList;
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
    this.ingredientService.getList(searchParamMap)
      .subscribe((data: DataTable<Ingredient>) => {
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

  getSearchString(searchParamMap: Map<string, any>, searchModel: Ingredient): Map<string, string> {
    if (searchModel.ingredientsName) {
      searchParamMap.set("ingredientsName", searchModel.ingredientsName);
    }
    if (searchModel.status) {
      searchParamMap.set("status", searchModel.status);
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
    const dialogRef = this.dialog.open(AddIngredientComponent);
    dialogRef.componentInstance.statusList = this.statusList;
    dialogRef.afterClosed().subscribe(result => {
      this.reset();
    });
  }

  edit(id: any) {
    const dialogRef = this.dialog.open(UpdateIngredientComponent, { data: id });
    dialogRef.componentInstance.statusList = this.statusList;
    dialogRef.afterClosed().subscribe(result => {
      this.reset();
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(DeleteIngredientComponent, { data: id, width: '350px', height: '180px' });

    dialogRef.afterClosed().subscribe(result => {
      this.reset();
    });
  }

  view(id: any) {
    const dialogRef = this.dialog.open(ViewIngredientComponent, { data: id });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  // Getters for form controls
  get ingredientsName() {
    return this.biteSearch.get('ingredientsName');
  }

  get status() {
    return this.biteSearch.get('status');
  }
}

