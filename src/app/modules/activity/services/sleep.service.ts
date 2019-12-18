import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import { Sleep } from '../models/sleep'
import { SearchForPeriod } from '../../measurement/models/measurement'

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

    getAll(userId: string, page?: number, limit?: number, search?: SearchForPeriod): Promise<HttpResponse<Sleep[]>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            if (search.start_at) {
                myParams = myParams.append('start_at', search.start_at);
            }
            if (search.end_at) {
                myParams = myParams.append('end_at', search.end_at);
            }
            if (search.period) {
                myParams = myParams.append('period', search.period);
            }

        }

        myParams = myParams.append('sort', '+timestamp');

        const url = `${environment.api_url}/${this.version}/patients/${userId}/sleep`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    getById(userId: string, sleepId: string): Promise<Sleep> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${userId}/sleep/${sleepId}`)
            .toPromise();
    }

    remove(userId: string, sleepId: string): Promise<any> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/patients/${userId}/sleep/${sleepId}`)
            .toPromise();
    }

}
