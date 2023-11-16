import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostLoginRoutingModule } from './post-login-routing.module';
import { PostLoginComponent } from './post-login.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { FoodcityManagementComponent } from './foodcity-management/foodcity-management.component';
import { PendingOrderComponent } from './pending-order/pending-order.component';
import { ApprovedOrderComponent } from './approved-order/approved-order.component';
import { DeliveredOrderComponent } from './delivered-order/delivered-order.component';
import { TrendingItemComponent } from './trending-item/trending-item.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { UserManagementComponent } from './user-management/user-management.component';
import { DeleteUserComponent } from './user-management/delete-user/delete-user.component';
import { EditUserComponent } from './user-management/edit-user/edit-user.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { ViewUserComponent } from './user-management/view-user/view-user.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RegexFormateModule } from 'src/app/utility/directive/regex-formate.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Empty } from 'src/app/utility/pipes/empty';

@NgModule({
  declarations: [
    Empty,
    PostLoginComponent,
    DashboardComponent,
    CustomerManagementComponent,
    FoodcityManagementComponent,
    PendingOrderComponent,
    ApprovedOrderComponent,
    DeliveredOrderComponent,
    TrendingItemComponent,
    CategoryManagementComponent,
    UserManagementComponent,
    DeleteUserComponent,
    EditUserComponent,
    AddUserComponent,
    ViewUserComponent,
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule,
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
export class PostLoginModule { }
