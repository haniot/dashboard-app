import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PhysicalActivity } from '../models/physical.activity'
import { environment } from '../../../../environments/environment'
import { TimeSeries } from '../models/time.series'

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

    getAll(patientId: string): Promise<PhysicalActivity[]> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/physicalactivities`)
            .toPromise();
    }

    getByLink(link: string): Promise<TimeSeries> {
        return this.http.get<any>(`${environment.api_url}${link}`)
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
