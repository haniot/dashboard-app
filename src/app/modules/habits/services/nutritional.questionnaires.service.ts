import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { NutritionalQuestionnaire } from '../models/nutritional.questionnaire'

@Injectable()
export class NutritionalQuestionnairesService {

    constructor(private http: HttpClient) {
    }


    getById(patientId: string, nutritionalQuestionnaireId: string): Promise<NutritionalQuestionnaire> {
        return this.http.get<any>(`${environment.api_url}/patients/${patientId}/nutritional/questionnaires/${nutritionalQuestionnaireId}`)
            .toPromise();
    }

    getAll(patientId: string, page?: number, limit?: number): Promise<NutritionalQuestionnaire[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        myParams = myParams.append('sort', '+created_at');

        const url = `${environment.api_url}/patients/${patientId}/nutritional/questionnaires`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    remove(patientId: string, nutritionalQuestionnaireId: string): Promise<NutritionalQuestionnaire> {
        return Promise.resolve(new NutritionalQuestionnaire());
        const url = `${environment.api_url}/patients/${patientId}/nutritional/questionnaires/${nutritionalQuestionnaireId}`;
        return this.http.delete<any>(url)
            .toPromise();
    }

}
