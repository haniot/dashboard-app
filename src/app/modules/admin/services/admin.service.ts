import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Admin } from '../models/users';
import { User } from '../../../shared/shared.models/user';

@Injectable()
export class AdminService {

    constructor(private http: HttpClient) {
    }


    getById(id: string): Promise<any> {
        return this.http.get<any>(`${environment.api_url}/users/admins/${id}`)
            .toPromise();
    }

    getAll(page?: number, limit?: number, search?: string): Promise<User[]> {
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

        const url = `${environment.api_url}/users/admins`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    create(administrator: Admin): Promise<User> {
        return this.http.post<any>(`${environment.api_url}/users/admins`, administrator)
            .toPromise();
    }

    update(administrator: Admin): Promise<User> {

        return this.http.patch<any>(`${environment.api_url}/users/admins/${administrator.id}`, administrator)
            .toPromise();
    }
}
