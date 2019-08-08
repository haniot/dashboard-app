import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PilotStudy } from '../models/pilot.study';
import { environment } from 'environments/environment';
import { OdontologicEvaluation } from '../../evaluation/models/odontologic-evaluation';
import { DateRange } from '../models/range-date';

@Injectable()
export class PilotStudyService {

    constructor(private http: HttpClient) {
    }


    getById(id: string): Promise<PilotStudy> {
        return this.http.get<any>(`${environment.api_url}/pilotstudies/${id}`)
            .toPromise();
    }

    getAllByUserId(userId: string, page?: number, limit?: number, search?: string): Promise<PilotStudy[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            myParams = myParams.append('?name', '*' + search + '*');
        }


        const url = `${environment.api_url}/healthprofessionals/${userId}/pilotstudies`;


        /*
        * TODO: Verficar o tipo de usuário e modificar a url. Por exemplo, se for um:
        * healthProfessional: `${environment.api_url}/users/healthprofessionals/${userId}/pilotstudies`
        * patient: `${environment.api_url}/users/patients/${userId}/pilotstudies`
        */

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    getAll(page?: number, limit?: number, search?: string): Promise<PilotStudy[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            myParams = myParams.append('?name', '*' + search + '*');
        }

        myParams = myParams.append('sort', '+created_at');

        const url = `${environment.api_url}/pilotstudies`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    getAllFiles(pilotstudy_id: string, page?: number, limit?: number, search?: DateRange): Promise<OdontologicEvaluation[]> {
        let myParams = new HttpParams();


        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }


        if (search && search.begin && search.end) {

            const start_at = search.begin.toISOString().split('T')[0];
            const end_at = search.end.toISOString().split('T')[0];

            myParams = myParams.append('created_at', 'gte:' + start_at);

            myParams = myParams.append('created_at', 'lte:' + end_at);


        }

        myParams = myParams.append('sort', '+created_at');

        const url = `${environment.api_url}/pilotstudies/${pilotstudy_id}/odontological/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    removeFile(pilotStudyId: string, file_id): Promise<boolean> {
        return this.http.delete<any>(`${environment.api_url}/pilotstudies/${pilotStudyId}/odontological/evaluations/${file_id}`)
            .toPromise();
    }

    generateNewFile(pilotStudy: PilotStudy, health_professional_id: string): Promise<OdontologicEvaluation> {

        const body = { pilotstudy: pilotStudy, health_professional_id: health_professional_id }

        return this.http.post<any>(`${environment.api_url}/pilotstudies/${pilotStudy.id}/odontological/evaluations`, body)
            .toPromise();
    }

    create(pilotstudy: PilotStudy): Promise<boolean> {
        return this.http.post<any>(`${environment.api_url}/pilotstudies`, pilotstudy)
            .toPromise();
    }

    update(pilotstudy: PilotStudy): Promise<boolean> {
        return this.http.patch<any>(`${environment.api_url}/pilotstudies/${pilotstudy.id}`, pilotstudy)
            .toPromise();
    }

    remove(pilotstudyId: string): Promise<boolean> {
        return this.http.delete<any>(`${environment.api_url}/pilotstudies/${pilotstudyId}`)
            .toPromise();
    }

    getHealthProfessionalsByPilotStudyId(pilotStudyId: string) {
        return this.http.get<any>(`${environment.api_url}/pilotstudies/${pilotStudyId}/healthprofessionals`)
            .toPromise();
    }

    addHealthProfessionalsToPilotStudy(pilotStudyId: string, healthprofessinalId: string): Promise<PilotStudy> {
        return this.http.post<any>(`${environment.api_url}/pilotstudies/${pilotStudyId}/healthprofessionals/${healthprofessinalId}`, {})
            .toPromise();
    }

    dissociateHealthProfessionalsFromPilotStudy(pilotStudyId: string, healthprofessinalId: string): Promise<boolean> {
        return this.http.delete<any>(`${environment.api_url}/pilotstudies/${pilotStudyId}/healthprofessionals/${healthprofessinalId}`)
            .toPromise();
    }
}
