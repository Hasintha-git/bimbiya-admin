import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostLoginComponent } from './post-login.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { FoodcityManagementComponent } from './foodcity-management/foodcity-management.component';
import { PendingOrderComponent } from './pending-order/pending-order.component';
import { ApprovedOrderComponent } from './approved-order/approved-order.component';
import { DeliveredOrderComponent } from './delivered-order/delivered-order.component';
import { TrendingItemComponent } from './trending-item/trending-item.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { BiteSectionModule } from './bite-section/bite-section.module';
import { ShippedOrderComponent } from './shipped-order/shipped-order.component';
import { RejectedOrderComponent } from './rejected-order/rejected-order.component';
import { SignInComponent } from '../pre-login/sign-in/sign-in.component';
import { NotFoundComponent } from '../component/not-found/not-found.component';
import { AuthGuard } from 'src/app/utility/authguard/auth.guard';

const routes: Routes = [
  {
    path: 'base',
    component: PostLoginComponent, canActivateChild : [AuthGuard],
    children: [
    {path:'dashboard',component:DashboardComponent},
    {path:'pending-order',component:PendingOrderComponent},
    {path:'shipped-order',component:ShippedOrderComponent},
    {path:'canceled-order',component:RejectedOrderComponent},
    {path:'processing-order',component:ApprovedOrderComponent},
    {path:'delivered-order',component:DeliveredOrderComponent},
    {path:'trending-item',component:TrendingItemComponent},
    {path:'category-management',component:CategoryManagementComponent},
    {path:'user-management',component:UserManagementComponent},
    {
      path: 'bite-section',
      loadChildren: () => import('./bite-section/bite-section.module').then(m => m.BiteSectionModule),
    },
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostLoginRoutingModule { }
