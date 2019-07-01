import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'environments/environment';

import {Observable, of as observableOf} from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import * as JWT_decode from "jwt-decode";

import {tap} from 'rxjs/operators';
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private router: Router) {
    }

    check(): boolean {
        const token = this.decodeToken();
        if (!token) {
            return false;
        }
        const user = this.localStorageService.getItem('user');

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
                        this.localStorageService.setItem('token', data.access_token)
                        let decodedToken: { sub: string, iss: string, iat: number, exp: number, scope: string };
                        try {
                            decodedToken = JWT_decode(data.access_token);
                        } catch (Error) {
                            this.localStorageService.logout();// clean local storage
                            return false;
                        }
                        this.localStorageService.setItem('user', decodedToken.sub);
                    }
                })
            );
    }

    logout(): void {
        this.localStorageService.logout();
        this.router.navigate(['auth/login']);
    }

    // getUser(): User {
    //     return localStorage.getItem('user') ? JSON.parse(atob(localStorage.getItem('user')))[0] : null;
    // }

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
        return this.decodeToken().scope;
    }

    decodeToken(): { sub: string, sub_type: string, iss: string, iat: number, exp: number, scope: string } {
        const token = this.localStorageService.getItem('token');
        let decodedToken: { sub: string, sub_type: string, iss: string, iat: number, exp: number, scope: string };
        try {
            decodedToken = JWT_decode(token);
        } catch (Error) {
            decodedToken = {sub: "", sub_type: "", iss: "", iat: 0, exp: 0, scope: ""};
        }
        return decodedToken;
    }

}
