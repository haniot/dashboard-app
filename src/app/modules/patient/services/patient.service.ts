import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Patient } from '../models/patient';

@Injectable()
export class PatientService {

    constructor(private http: HttpClient) {
    }

    getById(patientId: string): Promise<Patient> {
        return this.http.get<any>(`${environment.api_url}/patients/${patientId}`)
            .toPromise();
    }


    getAllByPilotStudy(pilotstudyId: string, page?: number, limit?: number, search?: string): Promise<Patient[]> {
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

        const url = `${environment.api_url}/pilotstudies/${pilotstudyId}/patients`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    getAll(page?: number, limit?: number, search?: string): Promise<Patient[]> {
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

        const url = `${environment.api_url}/patients`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    create(patient: Patient): Promise<boolean> {
        return this.http.post<any>(`${environment.api_url}/patients`, patient)
            .toPromise();
    }

    update(patient: Patient): Promise<boolean> {
        return this.http.patch<any>(`${environment.api_url}/patients/${patient.id}`, patient)
            .toPromise();
    }

    remove(patientId: string): Promise<boolean> {
        return this.http.delete<any>(`${environment.api_url}/users/${patientId}`)
            .toPromise();
    }
}
