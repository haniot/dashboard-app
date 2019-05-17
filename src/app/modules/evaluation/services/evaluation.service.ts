import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { IEvaluation } from '../models/evaluation';

@Injectable()
export class EvaluationService {

    constructor(private http: HttpClient) { }

    getAll(page?: number, limit?: number, search?: string): Promise<IEvaluation[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        } else {
            myParams = myParams.append("limit", String(Number.MAX_SAFE_INTEGER));
        }

        if (search) {
            myParams = myParams.append("?search", "*" + search + "*");
        }

        const url = `${environment.api_url}/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    remove(patient_id: string, evaluation_id: string): Promise<any> {
        return this.http.delete<any>
            (`${environment.api_url}/patients/${patient_id}/evaluations/${evaluation_id}`)
            .toPromise();
    }
}
