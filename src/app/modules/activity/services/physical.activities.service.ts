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

    create(patientId: string, activity: PhysicalActivity): Promise<PhysicalActivity> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/patients/${patientId}/physicalactivities`, activity)
            .toPromise();
    }

    getAll(patientId: string): Promise<PhysicalActivity[]> {
        const listActivities: PhysicalActivity[] = [
            new PhysicalActivity('Run'),
            new PhysicalActivity('Walk'),
            new PhysicalActivity('Swim')
        ];

        return Promise.resolve(listActivities);

        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/physicalactivities`)
            .toPromise();
    }

    getById(patientId: string, activityId: string): Promise<PhysicalActivity> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(new PhysicalActivity())
            }, 3000);
        })
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/physicalactivities/${activityId}`)
            .toPromise();
    }

    remove(patientId: string, activityId: string): Promise<any> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/patients/${patientId}/physicalactivities/${activityId}`)
            .toPromise();
    }

}
