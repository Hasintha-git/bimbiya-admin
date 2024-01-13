import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements  CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService
) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.authService.isAuthenticated()){
      return true;
    }
    this.authService.logOut();
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.authService.isChildAuthenticated()){
      return true;
    }
    this.authService.logOut();
    return false;
  }

}
