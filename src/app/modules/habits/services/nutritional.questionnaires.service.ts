import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { NutritionalQuestionnaire } from '../models/nutritional.questionnaire'
import { QuestionnaireType } from '../models/questionnaire.type'
import { environment } from '../../../../environments/environment'

@Injectable()
export class NutritionalQuestionnairesService {

    constructor(private http: HttpClient) {
    }


    getById(patientId: string, nutritionalQuestionnaireId: string): Promise<NutritionalQuestionnaire> {
        return this.http.get<any>(`${environment.api_url}/patients/${patientId}/nutritional/questionnaires/${nutritionalQuestionnaireId}`)
            .toPromise();
    }

    getAll(patientId: string, page?: number, limit?: number): Promise<HttpResponse<NutritionalQuestionnaire[]>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        myParams = myParams.append('sort', '+created_at');

        const url = `${environment.api_url}/patients/${patientId}/nutritional/questionnaires`;

        return this.http.get<NutritionalQuestionnaire[]>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    remove(patientId: string, nutritionalQuestionnaireId: string): Promise<NutritionalQuestionnaire> {
        const url = `${environment.api_url}/patients/${patientId}/nutritional/questionnaires/${nutritionalQuestionnaireId}`;
        return this.http.delete<any>(url)
            .toPromise();
    }

    getAllTypes(): Promise<QuestionnaireType> {
        return this.http.get<any>(`${environment.api_url}/questionnaires/types`)
            .toPromise();
    }

}
