import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import * as JWT_decode from 'jwt-decode';
import { tap } from 'rxjs/operators';

import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { SessionStorageService } from '../../../shared/shared.services/session.storage.service'
import { environment } from '../../../../environments/environment'

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private sessionService: SessionStorageService,
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
        return this.http.post<any>(`${environment.api_url}/auth`, credentials, { params: myParams })
            .pipe(
                tap(data => {
                    if (data && data.access_token) {
                        this.localStorageService.setItem('token', data.access_token)
                        let decodedToken: { sub: string, iss: string, iat: number, exp: number, scope: string };
                        try {
                            decodedToken = JWT_decode(data.access_token);
                        } catch (Error) {
                            // clean local storage
                            this.localStorageService.logout();
                            return false;
                        }
                        this.localStorageService.setItem('user', decodedToken.sub);
                    }
                })
            );
    }

    logout(): void {
        this.localStorageService.logout();
        this.router.navigate(['/login']);
    }


    changePassword(credentials: { email: string, new_password: string }): Promise<any> {
        const temporaryToken = this.sessionService.getItem('temporaryToken');
        const headers = new HttpHeaders()
            .append('Content-Type', 'application/json')
            .append('Authorization', `Bearer ${temporaryToken}`);
        return this.http.patch<any>(`${environment.api_url}/auth/password`, credentials, { headers: headers })
            .pipe(
                tap(() => {
                    this.sessionService.clean();
                })
            )
            .toPromise();

    }

    forgot(email: string): Promise<any> {
        return this.http.post<any>(`${environment.api_url}/auth/forgot`, { email })
            .toPromise();
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
            decodedToken = { sub: '', sub_type: '', iss: '', iat: 0, exp: 0, scope: '' };
        }
        return decodedToken;
    }

    validateReCaptcha(responseRecaptcha: string): Promise<any> {
        return this.http.post<any>(
            `${environment.reCaptcha_urlVerify}?secret=${environment.reCaptcha_serverKey}&&response=${responseRecaptcha}`, {})
            .toPromise();
    }
}
