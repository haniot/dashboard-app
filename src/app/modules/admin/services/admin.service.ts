import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { IUser, Admin } from '../models/users.models';

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) { }


  getById(id: string): Promise<any> {
    return this.http.get<any>(`${environment.api_url}/users/admins/${id}`)
      .toPromise();
  }

  getAll(page?: number, limit?: number): Promise<IUser[]> {
    let myParams = new HttpParams();

    if (page && limit) {
      myParams = new HttpParams()
        .set("page", String(page))
        .set("limit", String(limit))
        .set("sort", 'created_a');
    }

    const url = `${environment.api_url}/users/admins`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }

  create(administrator: Admin): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/users/admins`, administrator)
      .toPromise();
  }

  update(administrator: Admin): Promise<boolean> {

    return this.http.patch<any>(`${environment.api_url}/users/admins/${administrator.id}`, administrator)
      .toPromise();

    // return this.getById(administrator.id)
    //   .then(adminOld => {
    //     Object.keys(adminOld).forEach(key => {
    //       if (adminOld[key] == administrator[key] && key != 'id') {
    //         delete administrator[key];
    //       }
    //     });
    //     return this.http.patch<any>(`${environment.api_url}/users/admins/${administrator.id}`, administrator)
    //       .toPromise();
    //   });
  }
}
