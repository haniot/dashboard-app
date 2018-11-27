import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { User } from './../interfaces/user.model';


@Injectable()
export class AuthService {


  constructor(private http: HttpClient, private router: Router) {

  }

  check(): boolean {
    return localStorage.getItem('user') ? true : false;
  }


  login(credentials: { email: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${environment.api_url}/users/auth`, credentials)
      .do(data => {
        console.log(data)
        if (data.redirect_link) {
          localStorage.setItem('redirect', data.redirect_link);
          this.router.navigate(['auth/change'], { queryParams: { redirect_link: data.redirect_link } });
        }else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', btoa(JSON.stringify(data.user)));
        }
      });
  }

  register(credentials: { name: string, email: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${environment.api_url}/users/admin`, credentials)
      .do(data => {
        console.log(data)
        this.router.navigate(['auth/login']);
        // Loga
        // localStorage.setItem('token', data.token);
        // localStorage.setItem('user', btoa(JSON.stringify(data.user)));
      });
  }

  getUserApi(id): Promise<boolean> {
    return this.http.get<any>(`${environment.api_url}/users/${id}`).toPromise()
      .then(data => {
        if (data.user) {
          localStorage.setItem('user', btoa(JSON.stringify(data.user)));
          return true;
        }
        return false;
      });
  }



  logout(): void {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }

  getUser(): User {
    return localStorage.getItem('user') ? JSON.parse(atob(localStorage.getItem('user')))[0] : null;
  }

  changePassowrd(credentials: { name: string, email: string, password: string }, redirect_link): Observable<boolean> {
    console.log('redirect_link2', redirect_link)

    return this.http.patch<any>(`${environment.api_url}/${redirect_link.slice(8)}`, credentials)
      .do(data => {
        console.log(data)
        this.router.navigate(['auth/login']);
      });
  }

  setUser(): Promise<boolean> {
    return this.http.get<any>(`${environment.api_url}/auth/me`).toPromise()
      .then(data => {
        if (data.user) {
          localStorage.setItem('user', btoa(JSON.stringify(data.user)));
          return true;
        }
        return false;
      });
  }

}
