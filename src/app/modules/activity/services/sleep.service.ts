import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import { Sleep } from '../models/sleep'

export class SleepFilter {
    type: string;
    start_time: string;
    end_time: string

    constructor(type: string, start_time: string, end_time: string) {
        this.type = type;
        this.start_time = start_time;
        this.end_time = end_time;
    }
}

@Injectable()
export class SleepService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    create(patientId: string, sleep: Sleep): Promise<Sleep> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/patients/${patientId}/sleep`, sleep)
            .toPromise();
    }

    getAll(patientId: string, page?: number, limit?: number, search?: SleepFilter):
        Promise<HttpResponse<Sleep[]>> {

        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search && search.start_time && search.end_time) {
            myParams = myParams.append('start_time', 'gte:' + search.start_time);
            myParams = myParams.append('start_time', 'lt:' + search.end_time);
        }

        myParams = myParams.append('sort', '-start_time');

        const url = `${environment.api_url}/${this.version}/patients/${patientId}/sleep`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    getById(patientId: string, sleepId: string): Promise<Sleep> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/sleep/${sleepId}`)
            .toPromise();
    }

    remove(patientId: string, sleepId: string): Promise<any> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/patients/${patientId}/sleep/${sleepId}`)
            .toPromise();
    }

}
