import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { OdontologicalQuestionnaire } from '../models/odontological.questionnaire'
import { NutritionalQuestionnaire } from '../models/nutritional.questionnaire'
import { environment } from '../../../../environments/environment'


@Injectable()
export class OdontologicalQuestionnairesService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    getById(patientId: string, questionnaireId: string): Promise<OdontologicalQuestionnaire> {
        const url = `${environment.api_url}/${this.version}/patients/${patientId}/odontological/questionnaires/${questionnaireId}`;
        return this.http.get<any>(url)
            .toPromise();
    }

    getAll(patientId: string, page?: number, limit?: number): Promise<HttpResponse<OdontologicalQuestionnaire[]>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        myParams = myParams.append('sort', '+created_at');

        const url = `${environment.api_url}/${this.version}/patients/${patientId}/odontological/questionnaires`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    remove(patientId: string, questionnaireId: string): Promise<any> {
        const url = `${environment.api_url}/${this.version}/patients/${patientId}/odontological/questionnaires/${questionnaireId}`;
        return this.http.delete<any>(url)
            .toPromise();
    }

    getAllTypes(): Promise<NutritionalQuestionnaire> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/questionnaires/types`)
            .toPromise();
    }

}
