import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiteSectionComponent } from './bite-section.component';
import { ProductManagementComponent } from './product-management/product-management.component';

const routes: Routes = [
  {path:'',component:BiteSectionComponent, children:[
    {path:'',redirectTo:'product',pathMatch:'full'},
    {path:'product',component:ProductManagementComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiteSectionRoutingModule { }
