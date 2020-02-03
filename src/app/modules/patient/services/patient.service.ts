import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { Patient } from '../models/patient';
import { environment } from '../../../../environments/environment'
import { PilotStudy } from '../../pilot.study/models/pilot.study'
import { DashboardService } from '../../dashboard/services/dashboard.service'
import { Goal } from '../models/goal'

@Injectable()
export class PatientService {
    version: string;

    constructor(
        private http: HttpClient,
        private dashboardService: DashboardService) {
        this.version = 'v1';
    }

    getById(patientId: string): Promise<Patient> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${patientId}`)
            .toPromise();
    }

    getAllByPilotStudy(pilotstudyId: string, page?: number, limit?: number, search?: string): Promise<HttpResponse<Patient[]>> {
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

        const url = `${environment.api_url}/${this.version}/pilotstudies/${pilotstudyId}/patients`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    getAllByPatientId(patientId: string, page?: number, limit?: number, search?: string): Promise<HttpResponse<PilotStudy[]>> {
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

        const url = `${environment.api_url}/${this.version}/patients/${patientId}/pilotstudies`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    getAll(page?: number, limit?: number, search?: string): Promise<HttpResponse<Patient[]>> {
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

        const url = `${environment.api_url}/${this.version}/patients`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    getGoals(patientId: string): Promise<Goal> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/goals`)
            .toPromise();
    }

    create(patient: Patient): Promise<Patient> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/patients`, patient)
            .toPromise()
            .then(respose => {
                this.dashboardService.updateUser()
                return Promise.resolve(respose)
            })
    }

    update(patient: Patient): Promise<Patient> {
        return this.http.patch<any>(`${environment.api_url}/${this.version}/patients/${patient.id}`, patient)
            .toPromise();
    }

    updateGoal(patientId: string, goal: Goal): Promise<Patient> {
        return this.http.patch<any>(`${environment.api_url}/${this.version}/patients/${patientId}/goals`, goal)
            .toPromise();
    }

    remove(patientId: string): Promise<boolean> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/users/${patientId}`)
            .toPromise()
            .then(respose => {
                this.dashboardService.updateUser()
                return Promise.resolve(respose)
            })
    }
}
