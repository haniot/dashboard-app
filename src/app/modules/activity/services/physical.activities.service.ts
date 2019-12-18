import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PhysicalActivity } from '../models/physical.activity'
import { environment } from '../../../../environments/environment'

@Injectable()
export class PhysicalActivitiesService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    create(userId: string, activity: PhysicalActivity): Promise<PhysicalActivity> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/patients/${userId}/physicalactivities`, activity)
            .toPromise();
    }

    getAll(userId: string): Promise<PhysicalActivity[]> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${userId}/physicalactivities`)
            .toPromise();
    }

    getById(userId: string, activityId: string): Promise<PhysicalActivity> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${userId}/physicalactivities/${activityId}`)
            .toPromise();
    }

    remove(userId: string, activityId: string): Promise<any> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/patients/${userId}/physicalactivities/${activityId}`)
            .toPromise();
    }

}
