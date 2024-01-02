import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {Observable,throwError} from 'rxjs';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';
import {timeout} from 'rxjs/operators';
import { DataTable } from 'src/app/pages/models/data-table';
import { CommonFunctionService } from '../common-functions/common-function.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  requestUrl: string;
  requestUrlPreLogin: string;

  constructor(public httpClient: HttpClient,public commonFunctionService: CommonFunctionService) { 
    this.requestUrl = `${getEndpoint(SECURE)}/user/v1/admin-user`;
    this.requestUrlPreLogin = `${getEndpoint(SECURE)}/auth`;
  }

  getSearchData(full: boolean): Observable<any> {
    const params = new HttpParams().set('full', full.toString());
    return this.httpClient.get(this.requestUrl + `/search-reference-data`, {
      responseType: 'json',
      params: params
    });
  }

  getList(searchParamMap: Map<string, string>): Observable<DataTable<any>> {
    const httpParams = this.commonFunctionService.getDataTableHttpParam(searchParamMap);
    return this.httpClient.get(this.requestUrl + `/filter-list`, {
      params: httpParams,
      responseType: 'json'
    });
  }

  get(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl + `/find-id`, object, { responseType: 'json' });
  }

  
  
  lockUser(id: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+ `/lock/`+ `${id}`, {
      responseType: 'json'
    });
  }

  unlockUser(id: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+ `/unlock/`+ `${id}`, {
      responseType: 'json'
    });
  }

  forgetPassword(object: any): Observable<any> {
    return this.httpClient.put(this.requestUrl+`/forget-password`, object, { responseType: 'json' });
  }

  deleteUser(id: any): Observable<any> {
    return this.httpClient.delete(this.requestUrl+ `/`+ `${id}`, {
      responseType: 'json'
    });
  }

  add(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl, object, { responseType: 'json' });
  }

  update(object: any): Observable<any> {
    return this.httpClient.put(this.requestUrl, object, { responseType: 'json' });
  }

  userRegister(object: any) {
    return this.httpClient.post(this.requestUrlPreLogin + `/register`  , object, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Referrer-Policy': 'no-referrer'
      }),
      responseType: 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  userLogin(object: any) {
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(this.requestUrlPreLogin+ `/login`,object,  { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Referrer-Policy': 'no-referrer'
      }),
      responseType: 'json'
    }) .pipe(
      catchError(this.handleError)
    );
  }
  

  private handleError(error: HttpErrorResponse) {
    console.log(error)
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 401 || error.status === 400) {
      errorMessage = error.error.msg || 'Authentication failure.';
    } else if (error.status === 500) {
      errorMessage = 'Application Error. Please Contact System Administrator.';
    } else if ( error.status === 404 ) {
      errorMessage = 'User Not Found';
    }else {
      errorMessage = error.error.msg || 'Unknown error occurred.';
    }
    console.error(errorMessage);
    return throwError(errorMessage); // Ensure the error message is returned
  }
  
  
}
