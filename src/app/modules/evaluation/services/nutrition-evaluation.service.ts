import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {environment} from 'environments/environment';
import {Patient} from "../../patient/models/patient";
import {NotificationEmail} from "../models/notification-email";
import {
    NutritionalCouncil,
    NutritionEvaluation
} from "../models/nutrition-evaluation";

@Injectable()
export class NutritionEvaluationService {

    constructor(private http: HttpClient) {
    }

    getAll(page?: number, limit?: number, search?: string): Promise<NutritionEvaluation[]> {
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
            myParams = myParams.append("?patient.name", "*" + search + "*");
        }

        const url = `${environment.api_url}/nutritional/evaluations`;

        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }

    getAllByPatient(patient_id: string, page?: number, limit?: number, search?: string): Promise<Array<NutritionEvaluation>> {
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
            myParams = myParams.append("?patient.name", "*" + search + "*");
        }

        const url = `${environment.api_url}/patients/${patient_id}/nutritional/evaluations`;

        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }

    getAllByPilotstudy(pilostudy_id: string, page?: number, limit?: number, search?: string): Promise<NutritionEvaluation[]> {
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
            myParams = myParams.append("?patient.name", "*" + search + "*");
        }

        const url = `${environment.api_url}/pilotstudies/${pilostudy_id}/nutritional/evaluations`;

        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }

    getAllByHealthprofessional(healthprofessional_id: string, page?: number, limit?: number, search?: string)
        : Promise<NutritionEvaluation[]> {
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
            myParams = myParams.append("?patient.name", "*" + search + "*");
        }

        const url = `${environment.api_url}/healthprofessionals/${healthprofessional_id}/nutritional/evaluations`;

        return this.http.get<any>(url, {params: myParams})
            .toPromise();

    }

    getById(patient_id: string, nutritionevaluation_id: string): Promise<NutritionEvaluation> {

        return this.http.get<any>(`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation_id}`)
            .toPromise();
    }

    finalize(evaluation_id: string, patient_id: string, counselings: NutritionalCouncil): Promise<NutritionEvaluation> {
        // console.log(counselings)
        return this.http.post<any>
        (`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${evaluation_id}/counselings`, counselings)
            .toPromise();
    }

    remove(patient_id: string, nutritionevaluation_id: string): Promise<NutritionEvaluation> {
        return this.http.delete<any>
        (`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation_id}`)
            .toPromise();
    }

}
