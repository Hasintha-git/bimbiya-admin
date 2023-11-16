import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastServiceService } from '../toast-service.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  requestUrl: string;
  session_User: any;

  constructor(   private toastr: ToastServiceService,public httpClient: HttpClient, private router: Router) {
    this.requestUrl = `${getEndpoint(SECURE)}`;
  }

  employeesStatisticsCurrentMonth(sessionUser: any): Observable<any> {
    this.session_User = sessionUser;
    return this.httpClient.get(this.requestUrl + `/statistics/employees/latest`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Referrer-Policy': 'no-referrer',
        'Authorization': 'Bearer '+ sessionUser['access_token']
      }),
      responseType: 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }


  getEmplopyeeStaticsTurnoverEvaluation(sessionUser: any): Observable<any> {
    // sessionUser['id']
    return this.httpClient.get(this.requestUrl + `/view/evaluation?id=` + `${29}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Referrer-Policy': 'no-referrer',
        'Authorization': 'Bearer ' + sessionUser['access_token']
      }),
      responseType: 'json'
    }) .pipe(
      catchError(this.handleError)
    );
  }

  refreshAccessToken(sessionUser: any) {
    return this.httpClient.get(this.requestUrl + `/auth/token/refresh`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Referrer-Policy': 'no-referrer',
          'Authorization': 'Bearer ' + sessionUser['refresh_token']
        }),
        responseType: 'json'
      }) .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  performanceWiseTurnover(sessionUser: any) {
    return this.httpClient.get(this.requestUrl + `/statistics/employees/performance`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Referrer-Policy': 'no-referrer',
          'Authorization': 'Bearer ' + sessionUser['access_token']
        }),
        responseType: 'json'
      }) .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  departmentWiseTurnover(sessionUser: any) {
    return this.httpClient.get(this.requestUrl + `/statistics/employees/department`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Referrer-Policy': 'no-referrer',
          'Authorization': 'Bearer ' + sessionUser['access_token']
        }),
        responseType: 'json'
      }) .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  topTurnOverDrivers(sessionUser: any) {
    return this.httpClient.get(this.requestUrl + `/statistics/employees/turnover_drivers`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Referrer-Policy': 'no-referrer',
          'Authorization': 'Bearer ' + sessionUser['access_token']
        }),
        responseType: 'json'
      }) .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  predictedTurnoverRatesEva(sessionUser: any) {
    return this.httpClient.get(this.requestUrl + `/statistics/employees/last_predictions`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Referrer-Policy': 'no-referrer',
          'Authorization': 'Bearer ' + sessionUser['access_token']
        }),
        responseType: 'json'
      }) .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      this.router.navigate(['/login'])
      // The backend returned a 401 status code, indicating authentication failure.
      errorMessage = error.error.msg;
      this.toastr.infoMessage(errorMessage)

    } else if (error.status === 500) {
      // The backend returned a 400 status code, indicating authentication failure.
      errorMessage = 'Application Error Please Contact System Administrator';
    } 
    else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `${error.error.MESSAGE}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  };
  

}
