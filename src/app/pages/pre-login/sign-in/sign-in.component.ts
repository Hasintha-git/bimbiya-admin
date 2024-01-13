import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { UserResponse } from 'src/app/models/response/user-response';
import { StorageService } from 'src/app/models/StorageService';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session/session-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BrowserData } from 'src/app/models/BrowserData';
import { CODE_REQUEST_INVALID_USERSESSION, CODE_REQUEST_TIMEOUT, CODE_REQUEST_UNAUTHORIZED, GATEWAY_TIMEOUT_ERROR_CODE, GLOBAL_SUCCESS_MESSAGE_PASSWORD_CHANGE, INTERNAL_SERVER_ERROR_CODE, NOT_FOUND_ERROR_CODE, UNABLE_TO_SERVE_REQUEST_DES } from 'src/app/utility/messages/messageVarList';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  hide = true;
  signInModel = new User();
  userForm: FormGroup;
  public browserData: BrowserData;

  
  // Error Messages
  public errorMessage: string;
  public warningMessage: string;
  public successMessage: string;

  constructor(private toastr: ToastServiceService,
    private spinner: NgxSpinnerService,
    private sessionService: SessionService,
    private _snackBar: MatSnackBar,
    private routerLink: Router, 
    private formBuilder: FormBuilder,
    private userService: UserService, 
    private sessionStorage: StorageService,
    public authService: AuthService,
    public route: ActivatedRoute,) { }

  ngOnInit(): void {

    this.isAuthenticated();
    
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
  setBrowserData() {
    this.browserData = new BrowserData();
    this.browserData.browserJavaEnabled = window.navigator.javaEnabled();
    this.browserData.browserLanguage = window.navigator.language;
    this.browserData.browserColorDepth = window.screen.colorDepth;
    this.browserData.browserScreenHeight = window.screen.height;
    this.browserData.browserScreenWidth = window.screen.width;
    this.browserData.browserTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.browserData.browserUserAgent = window.navigator.userAgent;
    this.browserData.browserAcceptHeader = 'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8';
  }


  onSubmit() {    
    this.errorMessage = null;
      if (this.userForm.valid) {
        this.spinner.show();
        console.log(this.signInModel)
        console.log(this.userService)
        this.userService.userLogin(this.signInModel).subscribe(
          (response: HttpResponse<any>) => {
            console.log("kkkkkkkkkkkkkkkkkkk",response.headers)
            this.sessionStorage.setSession(response.headers.get('Authorization'));
            this.sessionStorage.setRefreshToken(response.headers.get('Refresh-Token'));
            console.log(response)
            // this.sessionStorage.setItem("user",response.body.data.user);
            this.spinner.hide();
          },
            error => {
              if (error.status === GATEWAY_TIMEOUT_ERROR_CODE || error.status === INTERNAL_SERVER_ERROR_CODE
                || error.status === NOT_FOUND_ERROR_CODE) {
                this.errorMessage = UNABLE_TO_SERVE_REQUEST_DES;
                this.spinner.hide();
              } else {
                this.errorMessage = error.error['message'];
                this.spinner.hide();
              }
            }
            );
      } else {
        this.toastr.errorMessage('Please fill in all required fields');
        this.spinner.hide();
        this.mandatoryValidation(this.userForm)
      }
    }

  checkIfErrorCodeIsPresent() {
    let errorVal = '';
    this.route
      .queryParams
      .subscribe(params => {
        if (params['errorCode'] !== undefined) {
          errorVal = params['errorCode'];
        }
      });
    if (errorVal !== '') {
      if (CODE_REQUEST_TIMEOUT === errorVal) {
        this.errorMessage = 'Session timeout.';
      } else if (CODE_REQUEST_UNAUTHORIZED === errorVal) {
        this.errorMessage = 'Unauthorized.';
      } else if (CODE_REQUEST_INVALID_USERSESSION === errorVal) {
        this.errorMessage = 'Session expired.';
      }
    }
  }

  checkIfSuccessCodeIsPresent() {
    let successVal = '';
    this.route
      .queryParams
      .subscribe(params => {
        if (params['successCode'] !== undefined) {
          successVal = params['successCode'];
        }
      });
    if (successVal !== '') {
      if (successVal === GLOBAL_SUCCESS_MESSAGE_PASSWORD_CHANGE) {
        this.successMessage = GLOBAL_SUCCESS_MESSAGE_PASSWORD_CHANGE;
      }
    }
  }
  isAuthenticated(): void {
    if (this.authService.isAuthenticated()) {
      console.log("***********")
      this.authService.logIn();
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
