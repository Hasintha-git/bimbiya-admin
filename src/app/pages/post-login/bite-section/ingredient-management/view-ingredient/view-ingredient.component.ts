import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { Bite } from 'src/app/models/bite';
import { Ingredient } from 'src/app/models/ingredient';
import { ByteService } from 'src/app/services/byte/byte.service';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-view-ingredient',
  templateUrl: './view-ingredient.component.html',
  styleUrls: ['./view-ingredient.component.scss']
})
export class ViewIngredientComponent implements OnInit {

  public id: any;
  public ingredientModel = new Ingredient();

  constructor(private dialogRef: MatDialogRef<ViewIngredientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ingredientService: IngredientService,
    public toastService: ToastServiceService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this._prepare();
  }


  _prepare() {
    this.spinner.show();
    this.ingredientModel.ingredientsId = this.data;
    this.findById();
  }

  findById() {
    console.log(this.ingredientModel)
    this.ingredientService.get(this.ingredientModel).subscribe(
      (user: any) => {
        this.ingredientModel = user.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
          this.toastService.errorMessage(error.error['errorDescription']);
        
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
