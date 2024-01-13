import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostLoginModule } from './pages/post-login/post-login.module';
import { SignInComponent } from './pages/pre-login/sign-in/sign-in.component';
import { SignUpComponent } from './pages/pre-login/sign-up/sign-up.component';
import { AuthGuard } from './utility/authguard/auth.guard';

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
    children: [
      {
        path: 'main',
        canActivate: [AuthGuard], runGuardsAndResolvers: 'always',
        loadChildren: () => import('./pages/post-login/post-login.module').then(m => m.PostLoginModule)
      }
    ]
  },
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
