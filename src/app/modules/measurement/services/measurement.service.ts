import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {environment} from 'environments/environment';
import {IMeasurement, Measurement} from '../models/measurement';
import {BloodPressure} from '../models/blood-pressure';
import {HeartRate} from '../models/heart-rate';

@Injectable()
export class MeasurementService {

    constructor(private http: HttpClient) {
    }

    getAll(page?: number, limit?: number, search?: string): Promise<IMeasurement[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        }

        if (search) {
            myParams = myParams.append("?type", "*" + search + "*");
        }

        myParams = myParams.append("sort", "+timestamp");

        const url = `${environment.api_url}/measurements`;

        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }

    getAllByUser(userId: string, page?: number, limit?: number, search?: string)
        : Promise<Array<IMeasurement | BloodPressure | HeartRate> | Array<any>> {

        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        }

        if (search) {
            myParams = myParams.append("?type", "*" + search + "*");
        }

        myParams = myParams.append("sort", "+timestamp");

        const url = `${environment.api_url}/users/${userId}/measurements`;

        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }

    getAllByUserAndType(userId: string, typeMeasurement: string, page?: number, limit?: number, search?: {
        start_at: string,
        end_at: string,
        period?: string
    }): Promise<Array<IMeasurement | BloodPressure | HeartRate> | Array<any>> {

        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        }

        if (typeMeasurement) {
            myParams = myParams.append("type", typeMeasurement);
        }

        if (search) {
            if (search.start_at) {
                myParams = myParams.append("start_at", search.start_at);
            }
            if (search.end_at) {
                myParams = myParams.append("end_at", search.end_at);
            }
            if (search.period) {
                myParams = myParams.append("period", search.period);
            }

        }

        myParams = myParams.append("sort", "+timestamp");

        const url = `${environment.api_url}/users/${userId}/measurements`;

        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }

    create(userId: string, measurement: Measurement): Promise<IMeasurement> {
        return this.http.post<any>(`${environment.api_url}/users/${userId}/measurements`, measurement)
            .toPromise();
    }

    getById(userId: string, measurementId: string): Promise<IMeasurement> {
        return this.http.get<any>(`${environment.api_url}/users/${userId}/measurements/${measurementId}`)
            .toPromise();
    }

    remove(userId: string, measurementId: string): Promise<IMeasurement> {
        return this.http.delete<any>(`${environment.api_url}/users/${userId}/measurements/${measurementId}`)
            .toPromise();
    }

}
