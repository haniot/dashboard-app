import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { FitBitClient, OAuthUser, SynchronizeData } from '../../modules/patient/models/external.service'
import { Router } from '@angular/router'

@Injectable()
export class FitbitService {
    private _client: FitBitClient;
    version: string;

    constructor(
        private http: HttpClient,
        private router: Router) {
        this.version = 'v1';
    }

    get client(): FitBitClient {
        return this._client
    }

    set client(value: FitBitClient) {
        this._client = value
    }

    async getAuthorizeUrlCode(): Promise<any> {
        this.getClientUser()
            .then(clientUser => {
                const url = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientUser.client_id}` +
                    `&redirect_uri=http://localhost:4200/app/patients/fitbit&scope=activity%20nutrition%20heartrate%20` +
                    `location%20nutrition%20profile%20settings%20sleep%20social%20weight`;
                const options = `width=${500},height=${600},left=${0},top=${0}`;
                return window.open(url, 'Authorization', options);
            })
            .catch(err => {
                console.log('Error ao buscar urlCode fitbit!', err);
                return Promise.reject(err);
            })
    }

    getAccessToken(code: string): Promise<any> {
        return this.getClientUser()
            .then(clientUser => {
                const { client_id, client_secret } = clientUser;
                const encoded = btoa(client_id + ':' + client_secret);
                const httpOptions = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${encoded}`
                    })
                };
                const url = `https://api.fitbit.com/oauth2/token?client_id=${client_id}&grant_type=authorization_code` +
                    `&redirect_uri=http://localhost:4200/app/patients/fitbit&code=${code}`;
                return this.http.post<any>(url, {}, httpOptions)
                    .toPromise();
            })
            .catch(err => {
                console.log('Error ao buscar urlCode fitbit!', err);
                return Promise.reject(err);
            })
    }

    getClientUser(): Promise<FitBitClient> {
        if (this.client && this.client.client_id && this.client.client_secret) {
            return Promise.resolve(this.client);
        }
        return this.http.get<any>(`${environment.api_url}/${this.version}/fitbit`)
            .toPromise()
            .then(clientUser => this.client = clientUser)
            .catch(err => {
                console.log('Error ao buscar clientUser fitbit!', err);
            })
    }

    createUser(patientId: string, userData: OAuthUser): Promise<OAuthUser> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/users/${patientId}/fitbit/auth`, userData)
            .toPromise();
    }

    getUser(patientId: string): Promise<OAuthUser> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/users/${patientId}/fitbit/auth`)
            .toPromise();
    }

    revoke(patientId: string): Promise<any> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/users/${patientId}/fitbit/auth/revoke`, {})
            .toPromise();
    }

    synchronize(patientId: string): Promise<SynchronizeData> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/users/${patientId}/fitbit/auth/sync`, {})
            .toPromise();
    }

}
