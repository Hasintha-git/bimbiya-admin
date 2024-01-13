import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { StorageService } from '../local-storage.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { ToastServiceService } from '../toast-service.service';
import {
  ANOTHER_USER_LOGGED_ERROR_CODE,
  ANOTHER_USER_LOGGED_ERROR_DES,
  FORBIDDEN_ERROR_CODE,
  FORBIDDEN_ERROR_DES,
  SESSION_TIME_OUT_ERROR_CODE,
  SESSION_TIME_OUT_ERROR_DES,
  TOKEN_EXPIRED_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  UNAUTHORIZED_ERROR_DES
} from 'src/app/utility/messages/messageVarList';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(
    private storageService: StorageService,
    private loginService: UserService,
    private toastService: ToastServiceService,
    public authService: AuthService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.storageService.getSession()) {
      request = this.addToken(request, this.storageService.getSession());
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Check the response headers or content for token-related information
          // Update the session token if needed
          // For example:
          // const newToken = event.headers.get('new-token');
          // if (newToken) {
          //   this.storageService.setSession(newToken);
          // }
        }
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === TOKEN_EXPIRED_ERROR_CODE) {
          this.authService.logOut();
        } else if (error instanceof HttpErrorResponse && error.status === SESSION_TIME_OUT_ERROR_CODE) {
          this.toastService.errorMessage(SESSION_TIME_OUT_ERROR_DES);
          this.authService.logOut();
        } else if (error instanceof HttpErrorResponse && error.status === ANOTHER_USER_LOGGED_ERROR_CODE) {
          this.toastService.errorMessage(ANOTHER_USER_LOGGED_ERROR_DES);
          this.authService.logOut();
        } else if (error instanceof HttpErrorResponse && error.status === UNAUTHORIZED_ERROR_CODE) {
          this.toastService.errorMessage(UNAUTHORIZED_ERROR_DES);
          this.authService.logOut();
        } else if (error instanceof HttpErrorResponse && error.status === FORBIDDEN_ERROR_CODE) {
          this.toastService.errorMessage(FORBIDDEN_ERROR_DES);
          this.authService.logOut();
        }

        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `${token}`
      }
    });
  }
}
