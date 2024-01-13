import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/models/StorageService';
import { Order } from 'src/app/models/order';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { CommonFunctionService } from 'src/app/services/common-functions/common-function.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-order-status-change',
  templateUrl: './order-status-change.component.html',
  styleUrls: ['./order-status-change.component.scss']
})
export class OrderStatusChangeComponent implements OnInit {

  orderModelAdd = new Order();
  orderStatus: any;

  constructor(private dialogRef: MatDialogRef<OrderStatusChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    private spinner: NgxSpinnerService,
    private orderService: OrderService,
    public toastService: ToastServiceService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonFunctionService: CommonFunctionService,
    private sessionStorage: StorageService,
  ) { }



  ngOnInit(): void {
    this.orderModelAdd.orderId = this.data;
    const currentUser = this.sessionStorage.getItem("user");
    this.orderModelAdd.activeUser = currentUser.user.username;
  }

  onSubmit() {
    this.spinner.show();
    this.orderModelAdd.status=this.orderStatus;
    const token = sessionStorage.getItem('session');
      this.orderService.orderStatusUpdate(this.orderModelAdd,token).subscribe(
        (response: CommonResponse) => {
          this.toastService.successMessage(response.responseDescription);
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
            this.toastService.errorMessage(error.error['errorDescription']);
        }
      );
  }
  
  closeDialog() {
    this.dialogRef.close();
  }
}
