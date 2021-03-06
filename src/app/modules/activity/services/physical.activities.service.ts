import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PhysicalActivity } from '../models/physical.activity'
import { environment } from '../../../../environments/environment'

@Injectable()
export class PhysicalActivitiesService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    create(patientId: string, activity: PhysicalActivity): Promise<PhysicalActivity> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/patients/${patientId}/physicalactivities`, activity)
            .toPromise();
    }

    getAll(patientId: string, page?: number, limit?: number): Promise<HttpResponse<PhysicalActivity[]>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        myParams = myParams.append('sort', '-start_time');

        const url = `${environment.api_url}/${this.version}/patients/${patientId}/physicalactivities`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    getById(patientId: string, activityId: string): Promise<PhysicalActivity> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/physicalactivities/${activityId}`)
            .toPromise();
    }

    remove(patientId: string, activityId: string): Promise<any> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/patients/${patientId}/physicalactivities/${activityId}`)
            .toPromise();
    }

}
