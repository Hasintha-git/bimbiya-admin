import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { UserResponse } from 'src/app/models/response/user-response';
import { StorageService } from 'src/app/models/StorageService';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session/session-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  hide = true;
  signInModel = new User();
  userForm: FormGroup;
  constructor(private toastr: ToastServiceService,private spinner: NgxSpinnerService,private sessionService: SessionService,private _snackBar: MatSnackBar,private routerLink: Router, private formBuilder: FormBuilder,private userService: UserService, private sessionStorage: StorageService) { }

  ngOnInit(): void {

    
    this.initialValidator();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  initialValidator() {
    this.userForm = this.formBuilder.group({
      username: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control('', [Validators.required])
    });
  }

onSubmit() {    
    if (this.userForm.valid) {
      this.spinner.show();
      this.userService.userLogin(this.signInModel).subscribe((userResponse: any)=> {
          this.sessionStorage.setItem("user",userResponse.data);
          this.routerLink.navigateByUrl('/post-login')
          this.spinner.hide();

        if(userResponse.data != null) {
          this.sessionStorage.setItem("user",userResponse.data);
          this.routerLink.navigateByUrl('/post-login')

        }
      },
      error => {
        console.log(error)
        this.spinner.hide();
        this.toastr.errorMessage(error);
      }
      )
    } else {
      this.toastr.errorMessage('Please fill in all required fields');
      this.spinner.hide();
      this.mandatoryValidation(this.userForm)
    }
  }

  mandatoryValidation(formGroup: FormGroup) {
    // this.isEmptyThumbnail = false;
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl> formGroup.controls[key];
        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup> formGroup.controls[key];
          this.mandatoryValidation(formGroupChild);

        }
        control.markAsTouched();
      }
    }
  }

  signUp() {
    this.routerLink.navigateByUrl('/register')
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

}
