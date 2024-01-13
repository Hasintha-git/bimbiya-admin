import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { Bite } from 'src/app/models/bite';
import { Ingredient } from 'src/app/models/ingredient';
import { Order } from 'src/app/models/order';
import { OrderDetailResponse } from 'src/app/models/response/order-detail-response';
import { OrderResponse } from 'src/app/models/response/order-response';
import { Commondatasource } from 'src/app/pages/datasource/Commondatasource';
import { ByteService } from 'src/app/services/byte/byte.service';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {

  public id: any;
  public oderModel = new Order();
    public dataSourceUser: Commondatasource;
  public oderResponseModel = new OrderResponse();
  public dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [ 'orderDetailId', 'productName', 'quantity', 'unitPrice', 'subTotal', 'potion'];

  constructor(private dialogRef: MatDialogRef<ViewOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private oderService: OrderService,
    public toastService: ToastServiceService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this._prepare();
  }


  _prepare() {
    this.spinner.show();
    this.oderModel.orderId = this.data;
    this.findById();
  }

  findById() {
    console.log(this.oderModel)
    const token = sessionStorage.getItem('session');
    this.oderService.get(this.oderModel,token).subscribe(
      (user: any) => {
        this.oderResponseModel = user.data;
        
        // this.dataSourceUser.datalist = this.oderResponseModel.orderDetails;
        this.dataSource = new MatTableDataSource(this.oderResponseModel.orderDetails);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
          this.toastService.errorMessage(error.error['errorDescription']);
        
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

}

