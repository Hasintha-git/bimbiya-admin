import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Bite } from 'src/app/models/bite';
import { Ingredient } from 'src/app/models/ingredient';
import { CommonResponse } from 'src/app/models/response/CommonResponse';
import { ByteService } from 'src/app/services/byte/byte.service';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-delete-ingredient',
  templateUrl: './delete-ingredient.component.html',
  styleUrls: ['./delete-ingredient.component.scss']
})
export class DeleteIngredientComponent implements OnInit {

  public id: any;
  public ingredientModel = new Ingredient();

  constructor(private dialogRef: MatDialogRef<DeleteIngredientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ingredientService: IngredientService,
    public toastService: ToastServiceService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.ingredientModel.ingredientsId = this.data;
    this.id = this.data;
  }


  onSubmit() {
    this.spinner.show();
    this.ingredientService.delete(this.id).subscribe(
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
