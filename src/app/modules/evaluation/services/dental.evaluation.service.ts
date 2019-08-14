import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


import { OdontologicEvaluation } from '../models/odontologic-evaluation';
import { PilotStudy } from '../../pilot.study/models/pilot.study';
import { environment } from '../../../../environments/environment'


@Injectable()
export class DentalEvaluationService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    getAll(page?: number, limit?: number, search?: string): Promise<OdontologicEvaluation[]> {
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

        const url = `${environment.api_url}/${this.version}/odontological/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    getAllByPilotstudy(pilostudy_id: string, page?: number, limit?: number, search?: string): Promise<OdontologicEvaluation[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            myParams = myParams.append('?created_at', '*' + search + '*');
        }

        const url = `${environment.api_url}/${this.version}/pilotstudies/${pilostudy_id}/odontological/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }


    getById(pilotstudy: string, dentalevaluation_id: string): Promise<OdontologicEvaluation> {
        const url = `${environment.api_url}/${this.version}/pilotstudies/${pilotstudy}/odontological/evaluations/${dentalevaluation_id}`;
        return this.http.get<any>(url)
            .toPromise();
    }

    remove(pilotstudy: string, dentalevaluation_id: string): Promise<any> {
        const url = `${environment.api_url}/${this.version}/pilotstudies/${pilotstudy}/odontological/evaluations/${dentalevaluation_id}`;
        return this.http.delete<any>(url)
            .toPromise();
    }

    generateNewEvaluation(pilotStudy: PilotStudy, health_professional_id: string): Promise<OdontologicEvaluation> {

        const body = { pilotstudy: pilotStudy, health_professional_id: health_professional_id }

        return this.http.post<any>(`${environment.api_url}/${this.version}/pilotstudies/${pilotStudy.id}/odontological/evaluations`, body)
            .toPromise();
    }

}
