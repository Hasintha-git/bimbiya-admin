import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { StorageService } from 'src/app/models/StorageService';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { User } from 'src/app/models/user';
import { NicValidationService } from 'src/app/services/nic-validation/nic-validation.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  userAdd: FormGroup;
  userModelAdd = new User();
  public statusList: SimpleBase[];
  public userRoleList: SimpleBase[];
  maxDate = new Date();

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private formBuilder: FormBuilder,
    public toastService: ToastServiceService,
    private spinner: NgxSpinnerService,
    private nicValidationConfig: NicValidationService,
    private sessionStorage: StorageService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this._prepare();
  }

  _prepare() {
    this.initialValidator();
    const user=this.sessionStorage.getItem("user");
    this.userModelAdd.activeUserName = user.user.username;
  }

  initialValidator() {
    this.userAdd = this.formBuilder.group({
      username: this.formBuilder.control('', [
        Validators.required
      ]),
      fullName: this.formBuilder.control('', [
        Validators.required
      ]),
   nic: this.formBuilder.control('', [
        Validators.required,
        Validators.maxLength(12),
        Validators.pattern(/^([0-9]{9}[X|V|v]|[0-9]{12})$/),
      ]),
      password: this.formBuilder.control('', [
        Validators.required
      ]),
      confirmPassword: this.formBuilder.control('', [
        Validators.required
      ]),
      userRole: this.formBuilder.control('', [
        Validators.required
      ]),
      mobile: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(/^-?([0-9]\d*){10}?$/),
      ]),
      status: this.formBuilder.control('', [
        Validators.required
      ]),
      email: this.formBuilder.control('', [
        Validators.required, Validators.email
      ]),
      address: this.formBuilder.control('', []),
      city: this.formBuilder.control('', []),
      primaryEmail: ['', Validators.email],
      dateOfBirth: this.formBuilder.control('', [
        Validators.required
      ])
    }, { validator: this.passwordMatchValidator });

    this.userAdd.get('email').setValidators(Validators.email);
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
  }


  customNicValidator(isValid: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (isValid) {
        return null; // Return null if the NIC is valid
      } else {
        return { invalidNic: true }; // Return an error object if the NIC is invalid
      }
    };
  }

  onNicInputChange(event: any) {
    if (this.userAdd.get('nic').valid) {
      const inputValue = event.target.value;
      const dob = this.nicValidationConfig.extractBirthday(inputValue);
      this.userModelAdd.dateOfBirth = dob;
    } else {
      this.userModelAdd.dateOfBirth = null;
    }
  }

  mandatoryValidation(formGroup: FormGroup) {
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];
        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup>formGroup.controls[key];
          this.mandatoryValidation(formGroupChild);
        }
        control.markAsTouched();
      }
    }
  }

  resetUserAdd() {
    this.userAdd.reset();
  }

  onSubmit() {
    this.spinner.show();
    if (this.userAdd.valid) {
      this.userService.add(this.userModelAdd).subscribe(
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
    } else {
      this.spinner.hide();
      this.mandatoryValidation(this.userAdd)
    }
  }


  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  get username() {
    return this.userAdd.get('username');
  }

  get nic() {
    return this.userAdd.get('nic');
  }

  get mobile() {
    return this.userAdd.get('mobile');
  }

  get status() {
    return this.userAdd.get('status');
  }

  get fullname() {
    return this.userAdd.get('fullName');
  }

  get password() {
    return this.userAdd.get('password');
  }

  get confirmpassword() {
    return this.userAdd.get('confirmPassword');
  }

  get userRole() {
    return this.userAdd.get('userRole');
  }

  get email() {
    return this.userAdd.get('email');
  }

  get address() {
    return this.userAdd.get('address');
  }

  get city() {
    return this.userAdd.get('city');
  }

  get branchCode() {
    return this.userAdd.get('branchCode');
  }

  get dateofbirth() {
    return this.userAdd.get('dateOfBirth');
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
