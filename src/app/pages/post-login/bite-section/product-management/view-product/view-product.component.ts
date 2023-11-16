import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { User } from 'src/app/models/user';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {

  public id: any;
  public userModel = new User();
  public branchList: SimpleBase[];

  constructor(private dialogRef: MatDialogRef<ViewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    public toastService: ToastServiceService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this._prepare();
  }


  _prepare() {
    this.userModel.id = this.data;
    this.findById();
  }

  findById() {
    this.userService.get(this.userModel).subscribe(
      (user: any) => {
        this.userModel = user.data;
      }, error => {
          this.toastService.errorMessage(error.error['errorDescription']);
        
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
