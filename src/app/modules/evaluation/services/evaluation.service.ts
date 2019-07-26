import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Evaluation } from '../models/evaluation';

@Injectable()
export class EvaluationService {

    constructor(private http: HttpClient) {
    }

    getAll(page?: number, limit?: number, search?: string): Promise<Evaluation[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            myParams = myParams.append('?search', '*' + search + '*');
        }

        const url = `${environment.api_url}/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

}
