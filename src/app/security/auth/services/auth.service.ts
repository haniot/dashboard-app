import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import * as JWT_decode from 'jwt-decode';
import { tap } from 'rxjs/operators';
import * as RandExp from 'randexp';

import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { SessionStorageService } from '../../../shared/shared.services/session.storage.service'
import { environment } from '../../../../environments/environment'
import { LoadingService } from '../../../shared/shared.components/loading.component/service/loading.service'

@Injectable()
export class AuthService {
    version: string;

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private sessionService: SessionStorageService,
        private loadingService: LoadingService,
        private router: Router) {
        this.version = 'v1';
    }

    check(): boolean {
        const token = this.decodeToken();
        if (!token) {
            return false;
        }
        if (Date.now() >= token.exp * 1000) {
            return false;
        }
        const user = this.localStorageService.getItem('user');

        return user === token.sub;
    }


    login(credentials: { email: string, password: string }): Observable<boolean> {
        const myParams = new HttpParams();
        return this.http.post<any>(`${environment.api_url}/${this.version}/auth`, credentials, { params: myParams })
            .pipe(
                tap(async data => {
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
                        this.saveUserInLocalStorage(data.access_token);
                    }
                })
            );
    }

    logout(): void {
        this.localStorageService.logout();
        setTimeout(() => {
            this.router.navigate(['/login']);
            this.loadingService.close();
        }, 3000)
    }


    changePassword(credentials: { email: string, new_password: string }): Promise<any> {
        const temporaryToken = this.sessionService.getItem('temporaryToken');
        const headers = new HttpHeaders()
            .append('Content-Type', 'application/json')
            .append('Authorization', `Bearer ${temporaryToken}`);
        return this.http.patch<any>(`${environment.api_url}/${this.version}/auth/password`, credentials, { headers: headers })
            .pipe(
                tap(() => {
                    this.sessionService.clean();
                })
            )
            .toPromise();

    }

    forgot(email: string): Promise<any> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/auth/forgot`, { email })
            .toPromise();
    }

    getScopeUser(): String {
        return this.decodeToken().scope;
    }

    decodeToken(): { sub: string, sub_type: string, iss: string, iat: number, exp: number, scope: string } {
        const token = this.localStorageService.getItem('token');
        return this.decodeTokenJWT(token);
    }

    saveUserInLocalStorage(token: string): void {
        const typeUser = this.decodeTokenJWT(token).sub_type;
        const userId = this.decodeTokenJWT(token).sub;
        this.getUserById(userId, token)
            .then(user => {
                if (user) {
                    this.localStorageService.setItem('userLogged', JSON.stringify(user));
                    this.localStorageService.setItem('email', user.email);
                    if (typeUser === 'patient') {
                        this.localStorageService.selectedPatient(user);
                    }
                }
            })
            .catch(() => {
            });
    }

    getUserById(id: string, token: string): Promise<any> {
        let url = '';
        switch (this.decodeToken().sub_type) {
            case 'admin':
                url = `${environment.api_url}/${this.version}/admins/${id}`;
                break;

            case 'health_professional':
                url = `${environment.api_url}/${this.version}/healthprofessionals/${id}`;
                break;

            case 'patient':
                url = `${environment.api_url}/${this.version}/patients/${id}`;
                break;
        }


        const headers = new HttpHeaders()
            .append('Content-Type', 'application/json')
            .append('Authorization', `Bearer ${token}`);

        return this.http.get<any>(url, { headers: headers })
            .toPromise();
    }

    generatePassword(): string {
        const randexp = new RandExp(/[a-f]{3,5}[!@#\$%\^&]{1}[0-9]{2,4}/);
        return randexp.gen();
    }

    private decodeTokenJWT(token: string): { sub: string, sub_type: string, iss: string, iat: number, exp: number, scope: string } {
        let decodedToken: { sub: string, sub_type: string, iss: string, iat: number, exp: number, scope: string };
        try {
            decodedToken = JWT_decode(token);
        } catch (Error) {
            decodedToken = { sub: '', sub_type: '', iss: '', iat: 0, exp: 0, scope: '' };
        }
        return decodedToken;
    }
}
