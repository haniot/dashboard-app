import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PhysicalActivitiesService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    // create(userId: string, activity: Measurement): Promise<Measurement> {
    //     return this.http.post<any>(`${environment.api_url}/${this.version}/patients/${userId}/measurements`, measurement)
    //         .toPromise();
    // }
    //
    // getById(userId: string, measurementId: string): Promise<Measurement> {
    //     return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${userId}/measurements/${measurementId}`)
    //         .toPromise();
    // }
    //
    // remove(userId: string, measurementId: string): Promise<any> {
    //     return this.http.delete<any>(`${environment.api_url}/${this.version}/patients/${userId}/measurements/${measurementId}`)
    //         .toPromise();
    // }

}
