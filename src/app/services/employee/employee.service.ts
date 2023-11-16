import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  requestUrl: string;

  constructor(public httpClient: HttpClient, private router: Router) { 
    this.requestUrl = `${getEndpoint(SECURE)}`;
  }

  getEmployeeDetails(sessionUser: any, id:any): Observable<any> {
    return this.httpClient.get(this.requestUrl + `/employee/view?id=${id}`  , {
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

  getViewAnalytics(sessionUser: any, id:any): Observable<any> {
    return this.httpClient.get(this.requestUrl + `/employee/view/analytics?id=${id}`  , {
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

  getLastVsCurrentEva(sessionUser: any, id:any): Observable<any> {
    return this.httpClient.get(this.requestUrl + `/employee/view/evaluation?id=${id}`  , {
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

  updateEmployee(object: any,sessionUser: any): Observable<any> {
    return this.httpClient.put(this.requestUrl + `/employee/update`  , object, {
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

  deleteEmployee(sessionUser: any,id: any): Observable<any> {
    return this.httpClient.delete(this.requestUrl + `/employee/delete?id=${id}`  , {
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

  employeeRegister(object: any,sessionUser: any): Observable<any> {
    return this.httpClient.post(this.requestUrl + `/employee/register`  , object, {
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

  employeeAnalytics(sessionUser: any): Observable<any> {
    return this.httpClient.get(this.requestUrl + `/statistics/employees/analytics`  , {
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

  employeeAnalyticsSearch(object: any,sessionUser: any): Observable<any> {
    return this.httpClient.post(this.requestUrl + `/statistics/employees/analytics/serach`  ,object, {
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

  employeeAnalyticsSearchDownload(object: any,sessionUser: any): Observable<any> {
    return this.httpClient.post(this.requestUrl + `/statistics/employees/analytics/serach/download`  ,object, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
        'Referrer-Policy': 'no-referrer',
        'Authorization': 'Bearer ' + sessionUser['access_token']
      }),
      responseType: 'arraybuffer'
    }) .pipe(
      catchError(this.handleError.bind(this))
    );
  }

  employeeSurveyRegister(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl + `/employee/survey`  , object, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Referrer-Policy': 'no-referrer'
      }),
      responseType: 'json'
    }) .pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // drop down 1 - search 
  departments(sessionUser: any): Observable<any> {
    return this.httpClient.get(this.requestUrl + `/application/departments`  , {
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

    // drop down 2 - search 
    performance_categories(sessionUser: any): Observable<any> {
      return this.httpClient.get(this.requestUrl + `/application/performance_categories`  , {
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

      // drop down 3 - search 
      retention_pereiods(sessionUser: any): Observable<any> {
    return this.httpClient.get(this.requestUrl + `/application/retention_pereiods`  , {
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

    // drop down 4 - search 
    turnover_rates(sessionUser: any): Observable<any> {
      return this.httpClient.get(this.requestUrl + `/application/turnover_rates`  , {
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
    console.log(error)
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      this.router.navigate(['/login'])
      // The backend returned a 401 status code, indicating authentication failure.
      errorMessage = error.error.msg;
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
