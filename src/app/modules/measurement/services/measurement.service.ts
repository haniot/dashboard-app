import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { Measurement } from '../models/measurement';
import { BloodPressure } from '../models/blood.pressure';
import { MeasurementType } from '../models/measurement.types'
import { Weight } from '../models/weight';
import { environment } from '../../../../environments/environment'
import { MeasurementLast } from '../models/measurement.last'
import { TimeSeries } from '../../activity/models/time.series'

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

    // getAll(page?: number, limit?: number, search?: string): Promise<HttpResponse<Measurement[]>> {
    //     let myParams = new HttpParams();
    //
    //     if (page) {
    //         myParams = myParams.append('page', String(page));
    //     }
    //
    //     if (limit) {
    //         myParams = myParams.append('limit', String(limit));
    //     }
    //
    //     if (search) {
    //         myParams = myParams.append('?type', '*' + search + '*');
    //     }
    //
    //     myParams = myParams.append('sort', '+timestamp');
    //
    //     const url = `${environment.api_url}/${this.version}/measurements`;
    //
    //     return this.http.get<any>(url, { observe: 'response', params: myParams })
    //         .toPromise();
    // }

    getAllByUserAndType(userId: string, typeMeasurement: string, page?: number, limit?: number, search?: any):
        Promise<HttpResponse<Array<Measurement | Weight | BloodPressure | TimeSeries> | any>> {

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
            const { filter } = search
            if (filter) {
                let start_time, end_time, nextday;
                if (search.type === 'today') {
                    const dateSelected = new Date(filter.date);
                    start_time = dateSelected.toISOString().split('T')[0] + 'T03:00:00.000Z';
                    nextday = new Date(dateSelected.getTime() + (24 * 60 * 60 * 1000));
                    end_time = nextday.toISOString().split('T')[0] + 'T02:59:59.000Z';
                } else {
                    start_time = search.filter.start_date + 'T03:00:00.000Z';
                    nextday = new Date(new Date(search.filter.end_date).getTime() + (24 * 60 * 60 * 1000));
                    end_time = nextday.toISOString().split('T')[0] + 'T02:59:59.000Z';
                }
                myParams = myParams.append('timestamp', 'gte:' + start_time);
                myParams = myParams.append('timestamp', 'lt:' + end_time);
            }
        }

        myParams = myParams.append('sort', '-timestamp');

        const url = `${environment.api_url}/${this.version}/patients/${userId}/measurements`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    getLastByUser(userId: string): Promise<MeasurementLast> {
        const url = `${environment.api_url}/${this.version}/patients/${userId}/measurements/last`;
        return this.http.get<any>(url)
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
