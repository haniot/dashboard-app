import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {environment} from 'environments/environment';
import {OdontologicEvaluation} from '../models/odontologic-evaluation';
import {PilotStudy} from "../../pilot-study/models/pilot.study";


@Injectable()
export class DentalEvaluationService {

    constructor(private http: HttpClient) {
    }

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

        const url = `${environment.api_url}/odontological/evaluations`;

        return this.http.get<any>(url, {params: myParams})
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
            myParams = myParams.append("?created_at", "*" + search + "*");
        }

        const url = `${environment.api_url}/pilotstudies/${pilostudy_id}/odontological/evaluations`;

        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }


    getById(pilotstudy: string, dentalevaluation_id: string): Promise<OdontologicEvaluation> {

        return this.http.get<any>(`${environment.api_url}/pilotstudies/${pilotstudy}/odontological/evaluations/${dentalevaluation_id}`)
            .toPromise();
    }

    remove(pilotstudy: string, dentalevaluation_id: string): Promise<any> {

        return this.http.delete<any>(`${environment.api_url}/pilotstudies/${pilotstudy}/odontological/evaluations/${dentalevaluation_id}`)
            .toPromise();
    }

    generateNewEvaluation(pilotStudy: PilotStudy, health_professional_id: string): Promise<OdontologicEvaluation> {

        const body = {pilotstudy: pilotStudy, health_professional_id: health_professional_id}

        return this.http.post<any>(`${environment.api_url}/pilotstudies/${pilotStudy.id}/odontological/evaluations`, body)
            .toPromise();
    }

}
