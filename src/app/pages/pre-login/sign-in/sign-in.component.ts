import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session/session-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BrowserData } from 'src/app/models/BrowserData';
import { CODE_REQUEST_INVALID_USERSESSION, CODE_REQUEST_TIMEOUT, CODE_REQUEST_UNAUTHORIZED, GATEWAY_TIMEOUT_ERROR_CODE, GLOBAL_SUCCESS_MESSAGE_PASSWORD_CHANGE, INTERNAL_SERVER_ERROR_CODE, NOT_FOUND_ERROR_CODE, PASSWORD_WRONG, UNABLE_TO_SERVE_REQUEST_DES, UNAUTH_ERROR_CODE, USERNAME_WRONG } from 'src/app/utility/messages/messageVarList';
import { HttpResponse } from '@angular/common/http';
import { LoginService } from 'src/app/services/LoginService/login.service';
import { StorageService } from 'src/app/services/local-storage.service';

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
    private loginService: LoginService, 
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
      this.loginService.login(this.signInModel).subscribe( {
        next: (response: HttpResponse<any>) => this.handleSuccess(response),
        error: (error: any) => this.handleError(error)
        }
      );
    } else {
      this.toastr.errorMessage('Please fill in all required fields');
      this.spinner.hide();
      this.mandatoryValidation(this.userForm)
    }
  }

  private handleSuccess(response: HttpResponse<any>): void {
    //token set for session
    this.sessionStorage.setSession(response.headers.get('token'));
    this.sessionStorage.setRefreshToken(response.headers.get('refresh_token'));

    //user details set for session
    this.sessionStorage.setUser(response.body['user']);
    
    this.spinner.hide();
    this.authService.logIn();
  }

  private handleError(error: any): void {
    const isKnownError = [GATEWAY_TIMEOUT_ERROR_CODE, INTERNAL_SERVER_ERROR_CODE, NOT_FOUND_ERROR_CODE].includes(error.status);

    this.errorMessage = isKnownError ? UNABLE_TO_SERVE_REQUEST_DES : this.extractErrorMessage(error);
    this.spinner.hide();
  }

  private extractErrorMessage(error: any): string {
    // Fallback message if none provided
    const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred. Please try again later.';

    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      return error.error.message;
    }

    return DEFAULT_ERROR_MESSAGE;
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

  get username() {
    return this.userForm.get('username');
  }

  get password() {
    return this.userForm.get('password');
  }

}
