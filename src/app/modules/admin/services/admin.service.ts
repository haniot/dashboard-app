import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Admin } from '../models/admin';
import { GenericUser } from '../../../shared/shared.models/generic.user';

@Injectable()
export class AdminService {

    constructor(private http: HttpClient) {
    }


    getById(id: string): Promise<any> {
        return this.http.get<any>(`${environment.api_url}/admins/${id}`)
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

        const url = `${environment.api_url}/admins`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    create(administrator: Admin): Promise<GenericUser> {
        return this.http.post<any>(`${environment.api_url}/admins`, administrator)
            .toPromise();
    }

    update(administrator: Admin): Promise<GenericUser> {

        return this.http.patch<any>(`${environment.api_url}/admins/${administrator.id}`, administrator)
            .toPromise();
    }
}
