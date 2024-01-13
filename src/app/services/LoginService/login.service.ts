import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {getEndpoint, SECURE} from '../../utility/constants/end-point';
import {StorageService} from '../local-storage.service';
import { Token } from 'src/app/models/Token';
import {  tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private requestUrl: string = `${getEndpoint(SECURE)}/auth/login`;
  private tokenRequestUrl: string = `${getEndpoint(SECURE)}/token/refresh`;

  constructor(private httpClient: HttpClient,) {
  }

  login(object: any): any {
    return this.httpClient.post(this.requestUrl, object, {observe: 'response'});
  }



}
