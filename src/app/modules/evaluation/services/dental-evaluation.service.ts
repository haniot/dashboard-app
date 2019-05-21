import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { DentalEvaluation } from '../models/dental-evaluation';

const dental = new DentalEvaluation();
dental.total_patients = 20;
dental.created_at = "2018-11-19T14:40:00Z";
dental.file_csv = "https://drive.google.com/uc?export=download&id=1TB2sbzvOjSWu0MH5gzMIAK66gE9rVyF";
dental.file_xls = "https://drive.google.com/uc?export=download&id=1TB2sbzvOjSWu0MH5gzMIAK66gE9rVyF";

@Injectable()
export class DentalEvaluationService {

    constructor(private http: HttpClient) { }

    getAll(page?: number, limit?: number, search?: string): Promise<DentalEvaluation[]> {
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

        const url = `${environment.api_url}/dental/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    getAllByPilotstudy(pilostudy_id: string, page?: number, limit?: number, search?: string): Promise<DentalEvaluation[]> {
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

        const url = `${environment.api_url}/pilotstudies/${pilostudy_id}/nutritional/evaluations`;
        return Promise.resolve([dental]);
        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }


    getById(pilotstudy: string, dentalevaluation_id: string): Promise<DentalEvaluation> {
        return Promise.resolve(new DentalEvaluation())
        // return this.http.get<any>(`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation_id}`)
        //     .toPromise();
    }

}
