import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import {
    TimeSeries,
    TimeSeriesFullFilter,
    TimeSeriesIntervalFilter,
    TimeSeriesSimpleFilter,
    TimeSeriesTotals,
    TimeSeriesType
} from '../models/time.series'

@Injectable()
export class TimeSeriesService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    getByLink(link: string): Promise<TimeSeries> {
        return this.http.get<any>(`${environment.api_url}${link}`)
            .toPromise();
    }

    getAll(patientId: string, filter: TimeSeriesSimpleFilter): Promise<TimeSeriesTotals> {
        if (filter.start_date && filter.start_date.length > 10) {
            filter.start_date = filter.start_date.split('T')[0];
        }
        if (filter.end_date && filter.end_date.length > 10) {
            filter.end_date = filter.end_date.split('T')[0];
        }
        return this.http
            .get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/date/` +
                `${filter.start_date}/${filter.end_date}/timeseries`)
            .toPromise();
    }

    getWithResource(patientId: string, resource: TimeSeriesType, filter: TimeSeriesSimpleFilter): Promise<TimeSeries> {
        if (filter.start_date && filter.start_date.length > 10) {
            filter.start_date = filter.start_date.split('T')[0];
        }
        if (filter.end_date && filter.end_date.length > 10) {
            filter.end_date = filter.end_date.split('T')[0];
        }
        return this.http
            .get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/${resource}/date/` +
                `${filter.start_date}/${filter.end_date}/timeseries`)
            .toPromise();
    }

    getWithResourceAndInterval(patientId: string, resource: TimeSeriesType, filter: TimeSeriesIntervalFilter): Promise<TimeSeries> {
        return this.http
            .get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/${resource}/date/` +
                `${filter.date}/interval/${filter.interval}/timeseries`)
            .toPromise();
    }

    getWithResourceAndTime(patientId: string, resource: TimeSeriesType, filter: TimeSeriesFullFilter): Promise<TimeSeries> {
        return this.http
            .get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/${resource}/date/${filter.start_date}/` +
                `${filter.end_date}/time/${filter.start_time}/${filter.end_time}/interval/${filter.interval}/timeseries`)
            .toPromise();
    }

}
