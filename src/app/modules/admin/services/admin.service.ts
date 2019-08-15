import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { Admin } from '../models/admin';
import { GenericUser } from '../../../shared/shared.models/generic.user';
import { environment } from '../../../../environments/environment'

@Injectable()
export class AdminService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }


    getById(id: string): Promise<any> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/admins/${id}`)
            .toPromise();
    }

    getAll(page?: number, limit?: number, search?: string): Promise<HttpResponse<GenericUser[]>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            myParams = myParams.append('?email', '*' + search + '*');
        }

        const url = `${environment.api_url}/${this.version}/admins`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    create(administrator: Admin): Promise<GenericUser> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/admins`, administrator)
            .toPromise();
    }

    update(administrator: Admin): Promise<GenericUser> {
        return this.http.patch<any>(`${environment.api_url}/${this.version}/admins/${administrator.id}`, administrator)
            .toPromise();
    }
}
