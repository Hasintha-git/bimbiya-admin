import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Bite } from 'src/app/models/bite';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { User } from 'src/app/models/user';
import { ByteService } from 'src/app/services/byte/byte.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent implements OnInit {


  public id: any;
  public biteModel = new Bite();

  constructor(private dialogRef: MatDialogRef<DeleteProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private biteService: ByteService,
    public toastService: ToastServiceService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.biteModel.packageId = this.data;
    this.id = this.data;
  }


  onSubmit() {
    this.spinner.show();
    this.biteService.delete(this.id).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.dialogRef.close();
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
