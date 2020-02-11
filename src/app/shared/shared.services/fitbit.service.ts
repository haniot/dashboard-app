import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { FitBitClient, FitBitUser, SynchronizeData } from '../../modules/patient/models/external.service'

@Injectable()
export class FitbitService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    getClientUser(): Promise<FitBitClient> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/fitbit`)
            .toPromise();
    }

    createUser(patientId: string, userData: FitBitUser): Promise<FitBitUser> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/users/${patientId}/fitbit/auth`, userData)
            .toPromise();
    }

    getUser(patientId: string): Promise<FitBitUser> {
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
