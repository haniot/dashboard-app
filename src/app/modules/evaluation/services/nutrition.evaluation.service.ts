import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { NutritionalCouncil, NutritionEvaluation } from '../models/nutrition-evaluation';
import { environment } from '../../../../environments/environment'

@Injectable()
export class NutritionEvaluationService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    getAll(page?: number, limit?: number, search?: string): Promise<NutritionEvaluation[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            myParams = myParams.append('?patient.name', '*' + search + '*');
        }

        const url = `${environment.api_url}/${this.version}/nutritional/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    getAllByPatient(patient_id: string, page?: number, limit?: number, search?: string): Promise<HttpResponse<Array<NutritionEvaluation>>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            myParams = myParams.append('?patient.name', '*' + search + '*');
        }

        const url = `${environment.api_url}/${this.version}/patients/${patient_id}/nutritional/evaluations`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    getAllByHealthprofessional(healthprofessional_id: string, page?: number, limit?: number, search?: string)
        : Promise<HttpResponse<NutritionEvaluation[]>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            myParams = myParams.append('?patient.name', '*' + search + '*');
        }

        const url = `${environment.api_url}/${this.version}/healthprofessionals/${healthprofessional_id}/nutritional/evaluations`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();

    }

    getById(patient_id: string, nutritionevaluation_id: string): Promise<NutritionEvaluation> {
        const url = `${environment.api_url}/${this.version}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation_id}`;
        return this.http.get<any>(url)
            .toPromise();
    }

    finalize(evaluation_id: string, patient_id: string, counselings: NutritionalCouncil): Promise<NutritionEvaluation> {
        const url = `${environment.api_url}/${this.version}/patients/${patient_id}/nutritional/evaluations/${evaluation_id}/counselings`;
        return this.http.post<any>(url, counselings)
            .toPromise();
    }

    remove(patient_id: string, nutritionevaluation_id: string): Promise<NutritionEvaluation> {
        return this.http.delete<any>
        (`${environment.api_url}/${this.version}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation_id}`)
            .toPromise();
    }

}
