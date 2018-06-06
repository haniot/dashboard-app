import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import { environment } from 'environments/environment';

@Injectable()
export class UsersService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http
      .get(`${environment.api_url}/users`)
      .map(response => {
        return response;
      });
  }
}
