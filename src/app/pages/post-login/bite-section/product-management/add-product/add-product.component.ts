import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { StorageService } from 'src/app/models/StorageService';
import { Bite } from 'src/app/models/bite';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { ByteService } from 'src/app/services/byte/byte.service';
import { NicValidationService } from 'src/app/services/nic-validation/nic-validation.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { EXCEED_USER_IMAGE_MAX_SIZE, FILE_MAX_SIZE_500KB, INVALID_USER_IMAGE_TYPE } from 'src/app/utility/messages/messageVarList';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  productAdd: FormGroup;
  biteAdd = new Bite();
  public statusList: SimpleBase[];
  public portionList: SimpleBase[];
  public ingredientsList: SimpleBase[];
  public productCatList: SimpleBase[];
  maxDate = new Date();

  imageFile: File = null;
  isEmptyThumbnail = true;
  thumbnailImage:any;

  constructor(
    private biteService: ByteService,
    public dialogRef: MatDialogRef<AddProductComponent>,
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
    this.thumbnailImage = "assets/images/no_image.png";
    this.initialValidator();
    const user=this.sessionStorage.getItem("user");
    this.biteAdd.activeUser = user.user.username;
  }

  initialValidator() {
    this.productAdd = this.formBuilder.group({
      mealName: this.formBuilder.control('', [
        Validators.required
      ]),
      description: this.formBuilder.control('', [
        Validators.required
      ]),
      portion: this.formBuilder.control('', [
        Validators.required
      ]),
      price: this.formBuilder.control('', [
        Validators.required
      ]),
      ingredientList: this.formBuilder.control('', [
        // Validators.required
      ]),
      status: this.formBuilder.control('', [
        Validators.required
      ]),
      productCategory: this.formBuilder.control('', [
        Validators.required
      ]),
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

    if (this.biteAdd.img == null) {
      this.isEmptyThumbnail = false;
    } else  {
      this.isEmptyThumbnail = true;
    }
    console.log(this.isEmptyThumbnail)
    if (this.productAdd.valid && this.isEmptyThumbnail) {
      this.biteService.add(this.biteAdd).subscribe(
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

  selectFile(file: FileList): void {
    const image: any = file.item(0);
  
    // Check if the file is an image (JPEG, JPG, or PNG).
    if (image && (image.type === 'image/jpeg' || image.type === 'image/jpg' || image.type === 'image/png')) {
      // Check the file size.
      if (image.size < FILE_MAX_SIZE_500KB) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const imageElement = new Image();
          imageElement.src = event.target.result;
  
          imageElement.onload = () => {
            const width = imageElement.width;
            const height = imageElement.height;
  
            // Check aspect ratio.
            const aspectRatio = width / height;
            
            // Define acceptable aspect ratio range.
            const minAspectRatio = 1.76;
            const maxAspectRatio = 1.78;            
  
            if (aspectRatio >= minAspectRatio && aspectRatio <= maxAspectRatio) {
              // If both size and aspect ratio are valid, proceed.
              this.thumbnailImage = event.target.result;
              (<HTMLInputElement>document.getElementById('srcHelpLink')).style.display = 'flex';
              this.biteAdd.img = this.thumbnailImage;
              this.isEmptyThumbnail = true;
            } else {
              this.toastService.errorMessage('Image dimensions must be in the range of 1920x1080 - 1280x720 pixels.');
            }
          };
        };
        reader.readAsDataURL(image);
      } else {
        this.toastService.errorMessage(EXCEED_USER_IMAGE_MAX_SIZE);
      }
    } else {
      this.toastService.errorMessage(INVALID_USER_IMAGE_TYPE);
    }
  }
  

  get mealName() {
    return this.productAdd.get('mealName');
  }

  get description() {
    return this.productAdd.get('description');
  }

  get price() {
    return this.productAdd.get('price');
  }

  get portion() {
    return this.productAdd.get('portion');
  }
  get ingredientList() {
    return this.productAdd.get('ingredientList');
  }
  get status() {
    return this.productAdd.get('status');
  }
  get productCategory() {
    return this.productAdd.get('productCategory');
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
