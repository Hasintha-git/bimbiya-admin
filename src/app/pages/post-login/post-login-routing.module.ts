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

const routes: Routes = [
  {path:'',component:PostLoginComponent, children:[
    {path:'',redirectTo:'dashboard',pathMatch:'full'},
    {path:'dashboard',component:DashboardComponent},
    {path:'customer-management',component:CustomerManagementComponent},
    {path:'foodcity-management',component:FoodcityManagementComponent},
    {path:'pending-order',component:PendingOrderComponent},
    {path:'approved-order',component:ApprovedOrderComponent},
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
