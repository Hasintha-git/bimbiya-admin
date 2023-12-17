import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiteSectionRoutingModule } from './bite-section-routing.module';
import { BiteSectionComponent } from './bite-section.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { AddProductComponent } from './product-management/add-product/add-product.component';
import { EditProductComponent } from './product-management/edit-product/edit-product.component';
import { DeleteProductComponent } from './product-management/delete-product/delete-product.component';
import { ViewProductComponent } from './product-management/view-product/view-product.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { RegexFormateModule } from 'src/app/utility/directive/regex-formate.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { IngredientManagementComponent } from './ingredient-management/ingredient-management.component';
import { ViewIngredientComponent } from './ingredient-management/view-ingredient/view-ingredient.component';
import { UpdateIngredientComponent } from './ingredient-management/update-ingredient/update-ingredient.component';
import { AddIngredientComponent } from './ingredient-management/add-ingredient/add-ingredient.component';
import { DeleteIngredientComponent } from './ingredient-management/delete-ingredient/delete-ingredient.component';


@NgModule({
  declarations: [
    BiteSectionComponent,
    ProductManagementComponent,
    AddProductComponent,
    EditProductComponent,
    DeleteProductComponent,
    ViewProductComponent,
    IngredientManagementComponent,
    ViewIngredientComponent,
    UpdateIngredientComponent,
    AddIngredientComponent,
    DeleteIngredientComponent
  ],
  imports: [
    CommonModule,
    BiteSectionRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    FormsModule,
    MatInputModule,
    MatRadioModule,
    ClipboardModule,
    MatExpansionModule,
    MatPaginatorModule,
    RegexFormateModule,
    MatDialogModule,
    MatDatepickerModule,
    MatStepperModule,
    MatFormFieldModule
  ]
})
export class BiteSectionModule { }
