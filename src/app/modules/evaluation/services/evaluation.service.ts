import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Evaluation } from '../models/evaluation';
import { environment } from '../../../../environments/environment'

@Injectable()
export class EvaluationService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
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

        const url = `${environment.api_url}/${this.version}/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

}
