import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { Measurement, SearchForPeriod } from '../models/measurement';
import { BloodPressure } from '../models/blood-pressure';
import { HeartRate } from '../models/heart-rate';
import { MeasurementType } from '../models/measurement.types'
import { Weight } from '../models/weight';
import { environment } from '../../../../environments/environment'

@Injectable()
export class MeasurementService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    getAllTypes(): Promise<MeasurementType[]> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/measurements/types`)
            .toPromise();
    }

    getAll(page?: number, limit?: number, search?: string): Promise<HttpResponse<Measurement[]>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            myParams = myParams.append('?type', '*' + search + '*');
        }

        myParams = myParams.append('sort', '+timestamp');

        const url = `${environment.api_url}/${this.version}/measurements`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    getAllByUserAndType(userId: string, typeMeasurement: string, page?: number, limit?: number, search?: SearchForPeriod):
        Promise<HttpResponse<Array<Measurement | Weight | BloodPressure | HeartRate> | any>> {

        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (typeMeasurement) {
            myParams = myParams.append('type', typeMeasurement);
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

        const url = `${environment.api_url}/${this.version}/patients/${userId}/measurements`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    create(userId: string, measurement: Measurement): Promise<Measurement> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/patients/${userId}/measurements`, measurement)
            .toPromise();
    }

    getById(userId: string, measurementId: string): Promise<Measurement> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${userId}/measurements/${measurementId}`)
            .toPromise();
    }

    remove(userId: string, measurementId: string): Promise<any> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/patients/${userId}/measurements/${measurementId}`)
            .toPromise();
    }

}
