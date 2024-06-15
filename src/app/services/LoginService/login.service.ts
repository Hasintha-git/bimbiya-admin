import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {getEndpoint, SECURE} from '../../utility/constants/end-point';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private requestUrl: string = `${getEndpoint(SECURE)}/auth/authenticate`;
  private tokenRequestUrl: string = `${getEndpoint(SECURE)}/token/refresh`;

  constructor(private httpClient: HttpClient,) {
  }

  login(object: any): any {
    const headers = new HttpHeaders({
      'module': 'admin'
    });
    return this.httpClient.post(this.requestUrl, object, {
      headers: headers,
      observe: 'response'
    });
  }


// In your login service
refreshToken() {
  let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  return this.httpClient.post(this.tokenRequestUrl, {}, {
    observe: 'response', // Get the full HttpResponse
    headers: httpHeaders,
    responseType: 'json',
  }).pipe(
    // Directly tapping into the response to extract and store tokens might be handled here or after subscription
    map(response => {
      const tokens = {
        jwt: response.headers.get('token'),
        refreshToken: response.headers.get('refresh_token')
      };
      return tokens;
    })
  );
}

}
