import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'environments/environment';

import {Observable, of as observableOf} from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import * as JWT_decode from "jwt-decode";

import {tap} from 'rxjs/operators';
import {User} from '../interfaces/users.interfaces';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient, private router: Router) {
    }

    check(): boolean {
        const token = this.decodeToken();
        if (!token) {
            return false;
        }
        const user = atob(localStorage.getItem('user'));

        return user === token.sub;
    }


    login(credentials: { email: string, password: string }): Observable<boolean> {
        const myParams = new HttpParams();
        myParams.append('rejectUnauthorized', 'false');
        return this.http.post<any>(`${environment.api_url}/auth`, credentials, {params: myParams})
            .pipe(
                tap(data => {
                    if (data.redirect_link) {
                        localStorage.setItem("emailTemp", credentials.email)
                        this.router.navigate(['auth/change'], {queryParams: {redirect_link: data.redirect_link}});
                    } else {
                        localStorage.setItem('token', data.token);
                        let decodedToken: { sub: string, iss: string, iat: number, exp: number, scope: string };
                        try {
                            decodedToken = JWT_decode(data.token);
                        } catch (Error) {
                            localStorage.clear();
                            return false;
                        }
                        localStorage.setItem('user', btoa(decodedToken.sub));
                    }
                })
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('user');
        this.router.navigate(['auth/login']);
    }

    getUser(): User {
        return localStorage.getItem('user') ? JSON.parse(atob(localStorage.getItem('user')))[0] : null;
    }

    changePassowrd(credentials: { name: string, email: string, password: string }, redirect_link): Observable<boolean> {
        return this.http.patch<any>(`${environment.api_url}${redirect_link}`, credentials)
            .pipe(
                tap(data => {
                    this.router.navigate(['auth/login']);
                    return observableOf(true);
                })
            );

    }

    getScopeUser(): String {
        return this.decodeToken().scopes;
    }

    decodeToken(): { sub: string, sub_type: string, iss: string, iat: number, exp: number, scopes: string } {
        const token = localStorage.getItem('token');
        let decodedToken: { sub: string, sub_type: string, iss: string, iat: number, exp: number, scopes: string };
        try {
            decodedToken = JWT_decode(token);
        } catch (Error) {
            decodedToken = {sub: "", sub_type: "", iss: "", iat: 0, exp: 0, scopes: ""};
        }
        return decodedToken;
    }

}
