import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { AuthService } from '../../../security/auth/services/auth.service'
import { PilotStudy } from '../../pilot.study/models/pilot.study'
import { environment } from '../../../../environments/environment'
import { Patient } from '../../patient/models/patient'
import { NutritionEvaluation } from '../../evaluation/models/nutrition-evaluation'


@Injectable()
export class DashboardService {

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
    }

    /**
     * get all studies from a userId
     */
    getAllStudiesByUserId(userId: string, page?: number, limit?: number): Promise<HttpResponse<PilotStudy[]>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        let url = `${environment.api_url}/healthprofessionals/${userId}/pilotstudies`;
        const type_user = this.authService.decodeToken().sub_type;
        switch (type_user) {
            case 'admin':
                url = `${environment.api_url}/pilotstudies`;
                break;

            case 'health_professional':
                url = `${environment.api_url}/healthprofessionals/${userId}/pilotstudies`;
                break;

            case 'patient':
                url = `${environment.api_url}/patients/${userId}/pilotstudies`;
                break;
        }

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    /**
     * get all patients from a pilotstudyId
     */
    getAllPatients(pilotstudyId: string, page?: number, limit?: number): Promise<HttpResponse<Patient[]>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        const url = `${environment.api_url}/pilotstudies/${pilotstudyId}/patients`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    /**
     * get all evaluations from a patient
     */
    getAllEvaluations(userId: string, page?: number, limit?: number): Promise<HttpResponse<NutritionEvaluation[]>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        const url = `${environment.api_url}/patients/${userId}/nutritional/evaluations`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }
}
