import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { Patient } from '../models/patient';
import { environment } from '../../../../environments/environment'

@Injectable()
export class PatientService {
    version: string;

    constructor(private http: HttpClient) {
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

    create(patient: Patient): Promise<Patient> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/patients`, patient)
            .toPromise();
    }

    update(patient: Patient): Promise<Patient> {
        return this.http.patch<any>(`${environment.api_url}/${this.version}/patients/${patient.id}`, patient)
            .toPromise();
    }

    remove(patientId: string): Promise<boolean> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/users/${patientId}`)
            .toPromise();
    }
}
