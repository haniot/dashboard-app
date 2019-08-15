import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { HealthProfessional } from '../models/health.professional';
import { GenericUser } from '../../../shared/shared.models/generic.user';
import { environment } from '../../../../environments/environment'

@Injectable()

export class HealthProfessionalService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }


    getById(id: string): Promise<any> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/healthprofessionals/${id}`)
            .toPromise();
    }

    getAll(page?: number, limit?: number, search?: string): Promise<HttpResponse<HealthProfessional[]>> {
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

        const url = `${environment.api_url}/${this.version}/healthprofessionals`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();

    }

    create(healthprofessionals: HealthProfessional): Promise<GenericUser> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/healthprofessionals`, healthprofessionals)
            .toPromise();
    }

    update(healthprofessionals: HealthProfessional): Promise<HealthProfessional> {
        const url = `${environment.api_url}/${this.version}/healthprofessionals/${healthprofessionals.id}`;
        return this.http.patch<any>(url, healthprofessionals)
            .toPromise();
    }
}
