import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { environment } from 'environments/environment';
import { OdontologicEvaluation } from '../models/odontologic-evaluation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const dental = new OdontologicEvaluation();
dental.total_patients = 20;
dental.created_at = "2018-11-19T14:40:00Z";
dental.file_csv = "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/test.csv";
dental.file_xls = "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/test.csv";

const dental2 = new OdontologicEvaluation();
dental2.total_patients = 20;
dental2.created_at = "2018-11-19T14:40:00Z";
dental2.file_csv = "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/test.csv";
dental2.file_xls = "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/test.csv";

@Injectable()
export class DentalEvaluationService {

    constructor(private http: HttpClient) { }

    getAll(page?: number, limit?: number, search?: string): Promise<OdontologicEvaluation[]> {
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

    getAllByPilotstudy(pilostudy_id: string, page?: number, limit?: number, search?: string): Promise<OdontologicEvaluation[]> {
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
        return Promise.resolve([dental,dental2]);
        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }


    getById(pilotstudy: string, dentalevaluation_id: string): Promise<OdontologicEvaluation> {
        return Promise.resolve(new OdontologicEvaluation())
        // return this.http.get<any>(`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation_id}`)
        //     .toPromise();
    }

}
