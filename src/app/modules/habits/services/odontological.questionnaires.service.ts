import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { OdontologicalQuestionnaire } from '../models/odontological.questionnaire'


@Injectable()
export class OdontologicalQuestionnairesService {

    constructor(private http: HttpClient) {
    }

    getById(patientId: string, odontologicalQuestionnaireId: string): Promise<OdontologicalQuestionnaire> {
        const url = `${environment.api_url}/patients/${patientId}/odontological/questionnaires/${odontologicalQuestionnaireId}`;
        return this.http.get<any>(url)
            .toPromise();
    }

    getAll(patientId: string, page?: number, limit?: number): Promise<OdontologicalQuestionnaire[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        myParams = myParams.append('sort', '+created_at');

        const url = `${environment.api_url}/patients/${patientId}/odontological/questionnaires`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    remove(patientId: string, odontologicalQuestionnaireId: string): Promise<any> {
        const url = `${environment.api_url}/patients/${patientId}/odontological/questionnaires/${odontologicalQuestionnaireId}`;
        return this.http.delete<any>(url)
            .toPromise();
    }

}
