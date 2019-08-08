import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { HealthProfessional } from '../models/health.professional';
import { GenericUser } from '../../../shared/shared.models/generic.user';

@Injectable()

export class HealthProfessionalService {

    constructor(private http: HttpClient) {
    }


    getById(id: string): Promise<any> {
        return this.http.get<any>(`${environment.api_url}/healthprofessionals/${id}`)
            .toPromise();
    }

    getAll(page?: number, limit?: number, search?: string): Promise<HealthProfessional[]> {
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

        const url = `${environment.api_url}/healthprofessionals`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();

    }

    create(healthprofessionals: HealthProfessional): Promise<GenericUser> {
        return this.http.post<any>(`${environment.api_url}/healthprofessionals`, healthprofessionals)
            .toPromise();
    }

    update(healthprofessionals: HealthProfessional): Promise<HealthProfessional> {
        return this.http.patch<any>(`${environment.api_url}/healthprofessionals/${healthprofessionals.id}`, healthprofessionals)
            .toPromise();
    }
}
