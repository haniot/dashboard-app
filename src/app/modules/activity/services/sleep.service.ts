import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PhysicalActivity } from '../models/physical.activity'
import { environment } from '../../../../environments/environment'
import { Sleep } from '../models/sleep'

@Injectable()
export class SleepService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    create(userId: string, sleep: Sleep): Promise<Sleep> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/patients/${userId}/sleep`, sleep)
            .toPromise();
    }

    getAll(userId: string): Promise<PhysicalActivity[]> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${userId}/sleep`)
            .toPromise();
    }

    getById(userId: string, sleepId: string): Promise<PhysicalActivity> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${userId}/sleep/${sleepId}`)
            .toPromise();
    }

    remove(userId: string, sleepId: string): Promise<any> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/patients/${userId}/sleep/${sleepId}`)
            .toPromise();
    }

}
