import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  userAdd: FormGroup;
  userModelAdd = new User();
  public statusList: SimpleBase[];
  public userRoleList: SimpleBase[];
  maxDate = new Date();
  oldModel: string;
  id:any;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public toastService: ToastServiceService,
    private spinner: NgxSpinnerService,
    private nicValidationConfig: NicValidationService,
    private sessionStorage: StorageService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.spinner.show();
    this.id=this.data;
    this._prepare();
  }

  _prepare() {
    this.initialValidator();

    this.findById();
  }


  findById() {
    this.userModelAdd.id = this.id;
    this.userService.get(this.userModelAdd).subscribe(
      (user: any) => {
        this.userModelAdd = user.data;
        
        const currentUser = this.sessionStorage.getItem("user");
        this.userModelAdd.activeUserName = currentUser.user.username;
        this.oldModel = JSON.stringify(this.userModelAdd);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
          this.toastService.errorMessage(error.error['errorDescription']);
      }
      
    );
  }


  initialValidator() {
    this.userAdd = this.formBuilder.group({
      username: this.formBuilder.control({ value: '', disabled: true }, [Validators.required]),
      fullName: this.formBuilder.control('', [
        Validators.required
      ]),
      nic: this.formBuilder.control('', [
        Validators.required,
        Validators.maxLength(12),
        Validators.pattern(/^([0-9]{9}[X|V|v]|[0-9]{12})$/),
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
      dateOfBirth: this.formBuilder.control({ value: '', disabled: true }, [Validators.required]),
    });

    this.userAdd.get('email').setValidators(Validators.email);
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
    this.findById();
  }

  onSubmit() {
    this.spinner.show();
    if (JSON.stringify(this.userModelAdd) === this.oldModel) {
      this.spinner.hide();
      this.toastService.errorMessage('No change(s) detected.');
    }else
    if (this.userAdd.valid) {
      this.userService.update(this.userModelAdd).subscribe(
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
