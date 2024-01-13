import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';
import { timeout } from 'rxjs/operators';
import { DataTable } from 'src/app/pages/models/data-table';
import { CommonFunctionService } from '../common-functions/common-function.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  requestUrl: string;
  requestUrlPreLogin: string;

  constructor(public httpClient: HttpClient, public commonFunctionService: CommonFunctionService) {
    this.requestUrl = `${getEndpoint(SECURE)}/order/v1/admin-order`;
    this.requestUrlPreLogin = `${getEndpoint(SECURE)}/auth`;
  }

  private getRequestHeaders(token: string): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSearchData(full: boolean, token: string): Observable<any> {
    const params = new HttpParams().set('full', full.toString());
    const headers = this.getRequestHeaders(token);
    return this.httpClient.get(this.requestUrl + `/search-reference-data`, {
      responseType: 'json',
      params: params,
      headers: headers
    });
  }

  getList(searchParamMap: Map<string, string>, token: string): Observable<DataTable<any>> {
    const httpParams = this.commonFunctionService.getDataTableHttpParam(searchParamMap);
    const headers = this.getRequestHeaders(token);
    return this.httpClient.get(this.requestUrl + `/filter-list`, {
      params: httpParams,
      responseType: 'json',
      headers: headers
    });
  }

  get(object: any, token: string): Observable<any> {
    const headers = this.getRequestHeaders(token);
    return this.httpClient.post(this.requestUrl + `/find-id`, object, {
      responseType: 'json',
      headers: headers
    });
  }

  delete(id: any, token: string): Observable<any> {
    const headers = this.getRequestHeaders(token);
    return this.httpClient.delete(this.requestUrl + `/` + `${id}`, {
      responseType: 'json',
      headers: headers
    });
  }

  add(object: any, token: string): Observable<any> {
    const headers = this.getRequestHeaders(token);
    return this.httpClient.post(this.requestUrl, object, {
      responseType: 'json',
      headers: headers
    });
  }

  update(object: any, token: string): Observable<any> {
    const headers = this.getRequestHeaders(token);
    return this.httpClient.put(this.requestUrl, object, {
      responseType: 'json',
      headers: headers
    });
  }

  orderStatusUpdate(object: any, token: string): Observable<any> {
    const headers = this.getRequestHeaders(token);
    return this.httpClient.put(this.requestUrl + `/update-status`, object, {
      responseType: 'json',
      headers: headers
    });
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
    } else if (error.status === 404) {
      errorMessage = 'User Not Found';
    } else {
      errorMessage = error.error.msg || 'Unknown error occurred.';
    }
    console.error(errorMessage);
    return throwError(errorMessage); // Ensure the error message is returned
  }
}
