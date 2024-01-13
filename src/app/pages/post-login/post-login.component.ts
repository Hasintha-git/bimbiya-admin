import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session-service.service';
import { ForgetPasswordComponent } from './user-management/forget-password/forget-password.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.scss']
})
export class PostLoginComponent implements OnInit {
  isVisible = true;
  contentMargin = 240;
  activeRouter = "Dashboard";


  constructor(private router: Router, 
    private dialog: MatDialog,
    private sessionService: SessionService,    
    private sessionStorage: StorageService,
    private authService: AuthService,
    ) {
    this.sessionTimeOutSet();
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? this.titleChange(event.urlAfterRedirects): null

    })


  }

  sessionTimeOutSet() {
    this.sessionService._sessionExpired.next(false);
    this.sessionService.startTimer();
    this.sessionService.sessionExpired.subscribe((expired) => {
      if (expired) {
        this.router.navigate(['/login'])
      }
    });
  }

  titleChange(title:string) {
    let routUrl = title.replace('/post-login/main/base/','')
    const rout = routUrl.split('?')[0];

    if (rout=='dashboard') {
      this.activeRouter = 'Dashboard';
    }else if (rout=='pending-order') {
      this.activeRouter = 'Pending Order'
    } else if (rout ==='processing-order') {
      this.activeRouter = 'Processing Order'
    }  else if (rout ==='delivered-order') {
      this.activeRouter = 'Delivery Order'
    }  else if (rout ==='canceled-order') {
      this.activeRouter = 'Canceled Order'
    }  else if (rout ==='shipped-order') {
      this.activeRouter = 'Shipped Order'
    } 
    else if (rout =='bite-section/product') {
      this.activeRouter = 'Product Section > Product Management'
    }
    else if (rout =='bite-section/ingredient') {
      this.activeRouter = 'Product Section > Ingredient Management'
    }
    else if (rout =='user-management') {
      this.activeRouter = 'User Management'
    }
  }
  ngOnInit(): void {
  }

  onMenuToggle() {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) {
      this.contentMargin = 70;
    } else {
      this.contentMargin = 240;
    }
  }

  clickDisableSection() {
  }

  logoutUser() {
    this.authService.logOut();
  }

  forgetPassword() {

    const currentUser = this.sessionStorage.getUser();
    console.log(currentUser)

    const dialogRef = this.dialog.open(ForgetPasswordComponent, { data: currentUser, width: '600px', height: '230px' });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

