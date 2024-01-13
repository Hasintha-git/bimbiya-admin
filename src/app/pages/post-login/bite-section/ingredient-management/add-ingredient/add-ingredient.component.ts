import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { Ingredient } from 'src/app/models/ingredient';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { StorageService } from 'src/app/services/local-storage.service';
import { NicValidationService } from 'src/app/services/nic-validation/nic-validation.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss']
})
export class AddIngredientComponent implements OnInit {

  productAdd: FormGroup;
  ingredientAdd = new Ingredient();
  public statusList: SimpleBase[];
  public portionList: SimpleBase[];
  public ingredientsList: SimpleBase[];
  maxDate = new Date();

  imageFile: File = null;
  isEmptyThumbnail = true;
  thumbnailImage:any;

  constructor(
    private ingredientService: IngredientService,
    public dialogRef: MatDialogRef<AddIngredientComponent>,
    private formBuilder: FormBuilder,
    public toastService: ToastServiceService,
    private spinner: NgxSpinnerService,
    private nicValidationConfig: NicValidationService,
    private sessionStorage: StorageService,
    private router: Router
  ) {
  }

  ngOnInit() {
    
    console.log("ingredientService",this.ingredientService)
    this._prepare();
  }

  _prepare() {
    this.initialValidator();
    const currentUser = this.sessionStorage.getUser();
    console.log(currentUser)
    this.ingredientAdd.activeUser = currentUser;
  }

  initialValidator() {
    this.productAdd = this.formBuilder.group({
      ingredientsName: this.formBuilder.control('', [
        Validators.required
      ]),
      status: this.formBuilder.control('', [
        Validators.required
      ])
    });

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

  reset() {
    this.productAdd.reset();
  }

  onSubmit() {
    this.spinner.show();
    if (this.productAdd.valid) {
      this.ingredientService.add(this.ingredientAdd).subscribe(
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
      this.mandatoryValidation(this.productAdd)
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


  get ingredientsName() {
    return this.productAdd.get('ingredientsName');
  }

  get status() {
    return this.productAdd.get('status');
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
