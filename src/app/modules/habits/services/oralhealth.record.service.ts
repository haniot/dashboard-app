import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment'
import { OralHealthRecord } from '../models/oral.health.record';

@Injectable()
export class OralhealthRecordService {

    constructor(private http: HttpClient) {
    }


    getById(patientId: string, oralhealthRecordId: string): Promise<OralHealthRecord> {
        return this.http.get<any>(`${environment.api_url}/patients/${patientId}/oralhealthrecords/${oralhealthRecordId}`)
            .toPromise();
    }

    getAll(patientId: string, page?: number, limit?: number): Promise<OralHealthRecord[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        const url = `${environment.api_url}/patients/${patientId}/oralhealthrecords`;
        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }
}
