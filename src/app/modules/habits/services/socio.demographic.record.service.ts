import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { SocioDemographicRecord } from '../models/sociodemographic-record';

@Injectable()
export class SocioDemographicRecordService {

    constructor(private http: HttpClient) {
    }


    getById(patientId: string, sociodemographicRecordId: string): Promise<SocioDemographicRecord> {
        return this.http.get<any>(`${environment.api_url}/patients/${patientId}/sociodemographicrecords/${sociodemographicRecordId}`)
            .toPromise();
    }

    getAll(patientId: string, page?: number, limit?: number): Promise<SocioDemographicRecord[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        const url = `${environment.api_url}/patients/${patientId}/sociodemographicrecords`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }
}
