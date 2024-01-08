import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserService } from 'src/app/services/user/user.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  public id: any;

  constructor(
    private userService: UserService,
    public toastService: ToastServiceService,
    private router: Router,
    private spinner: NgxSpinnerService) {
  }

  prepareReferenceData(): void {
    this.userService.getDashboardCounts()
      .subscribe((response: any) => {
        console.log(response)
      },
        error => {
          this.toastService.errorMessage(error.error['message']);
        }
      );
  }

  ngOnInit(): void {
    this.prepareReferenceData();
  }

// Line Chart Data
lineChartData = [
  {
    name: 'Series A',
    series: [
      { name: 'Jan', value: 120 },
      { name: 'Feb', value: 150 },
      { name: 'Mar', value: 100 },
      { name: 'Jan', value: 120 },
      { name: 'Feb', value: 150 },
      { name: 'Mar', value: 100 },
      // Add more data points as needed
    ],
  },
];

// Pie Chart Data
pieChartData = [
  {
    name: 'Category A',
    value: 25,
  },
  {
    name: 'Category B',
    value: 60,
  },
  {
    name: 'Category C',
    value: 15,
  },
];

colorScheme = {
  domain: ['#0096FE', '#18CFFC', '#E6F2FD'],
};

  private handleUnauthorizedError() {
    // Clear token and navigate to the login page
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }
}
