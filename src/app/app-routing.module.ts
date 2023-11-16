import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostLoginModule } from './pages/post-login/post-login.module';
import { SignInComponent } from './pages/pre-login/sign-in/sign-in.component';
import { SignUpComponent } from './pages/pre-login/sign-up/sign-up.component';

const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {
    path: 'login',
    component: SignInComponent,
  },
  {
    path: 'register',
    component: SignUpComponent,
  },
  {
    path: 'post-login',
    loadChildren: () => PostLoginModule,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
