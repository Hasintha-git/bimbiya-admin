import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/models/response/user-response';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpModel = new User();
  userForm: FormGroup;
  hide = true;

  constructor(
    private toastr: ToastServiceService,
    private spinner: NgxSpinnerService,
    private routerLink: Router, 
    private formBuilder: FormBuilder,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.initialValidator()
  }
  initialValidator() {
  this.userForm = this.formBuilder.group({
    first_name : this.formBuilder.control('', [Validators.required]),
    // last_name : this.formBuilder.control('', [Validators.required]),
    email : this.formBuilder.control('', [Validators.required]),
    password : this.formBuilder.control('', [Validators.required])
  });
  }

  onSubmit() {
    this.spinner.show();
    if (this.userForm.valid) {
      this.userService.userRegister(this.signUpModel).subscribe((userResponse: any)=> {
        this.toastr.successMessage(userResponse.msg);
        // this.routerLink.navigateByUrl('/login')
        this.userForm.reset();
        Object.keys(this.userForm.controls).forEach(key => {
          const control = this.userForm.controls[key];
          control.clearValidators();
          control.updateValueAndValidity();
        });
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.errorMessage(error);
      })
    } else {
      this.spinner.hide();
      this.toastr.errorMessage('Please fill in all required fields');
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

  get first_name() {
    return this.userForm.get('first_name');
  }

  get last_name() {
    return this.userForm.get('last_name');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  } 
}
