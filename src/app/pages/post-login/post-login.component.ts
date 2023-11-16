import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session-service.service';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.scss']
})
export class PostLoginComponent implements OnInit {
  isVisible = true;
  contentMargin = 240;
  activeRouter = "Dashboard";
  isSurveyShareEnble: boolean;


  constructor(private router: Router, private dialog: MatDialog,private sessionService: SessionService) {
    this.sessionTimeOutSet();
    this.isSurveyShareEnble = true;
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
    let routUrl = title.replace('/post-login/','')
    const rout = routUrl.split('?')[0];

    if (rout=='dashboard') {
      this.activeRouter = 'Dashboard';
      this.isSurveyShareEnble = false;
    }else if (rout=='employee-analytics') {
      this.activeRouter = 'Employee Analytics'
      this.isSurveyShareEnble = true;
    } else if (rout ==='employee-analytics/employee-profile') {
      this.activeRouter = 'Employee Analytics > Employee Profile'
      this.isSurveyShareEnble = true;
    }  else if (rout ==='employee-analytics/employee-profile/edit-employee-profile') {
      this.activeRouter = 'Employee Analytics > Employee Profile > Edit Employee Profile'
      this.isSurveyShareEnble = true;
    } 
    else if (rout =='employee-analytics/add-employee') {
      this.activeRouter = 'Employee Analytics > Add New Employee'
      this.isSurveyShareEnble = true;
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
    this.router.navigate(['/login']);
  }
}

