import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import {HealthProfessional, IUser} from '../models/users';

@Injectable()

export class HealthProfessionalService {

  constructor(private http: HttpClient) { }


  getById(id: string): Promise<any> {
    return this.http.get<any>(`${environment.api_url}/users/healthprofessionals/${id}`)
      .toPromise();
  }

  getAll(page?: number, limit?: number, search?: string): Promise<HealthProfessional[]> {
    let myParams = new HttpParams();

    if (page) {
      myParams = myParams.append("page", String(page));
    }

    if (limit) {
      myParams = myParams.append("limit", String(limit));
    } else {
      myParams = myParams.append("limit", String(Number.MAX_SAFE_INTEGER));
    }

    if (search) {
      myParams = myParams.append("?name", '*' + search + '*');
    }

    const url = `${environment.api_url}/users/healthprofessionals`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();

  }

  create(healthprofessionals: HealthProfessional): Promise<IUser> {
    return this.http.post<any>(`${environment.api_url}/users/healthprofessionals`, healthprofessionals)
      .toPromise();
  }

  update(healthprofessionals: HealthProfessional): Promise<IUser> {
    return this.http.patch<any>(`${environment.api_url}/users/healthprofessionals/${healthprofessionals.id}`, healthprofessionals)
      .toPromise();
    // let copy_healthprofessionals = {};
    // return this.getById(healthprofessionals.id)
    //   .then(healthprofessionalsOld => {
    //     Object.keys(healthprofessionalsOld).forEach(key => {
    //       if (healthprofessionalsOld[key] != healthprofessionals[key] || key == 'id') {
    //         copy_healthprofessionals[key] =  healthprofessionals[key];
    //       }
    //     });
    //     return this.http.patch<any>(`${environment.api_url}/users/healthprofessionals/${healthprofessionals.id}`, copy_healthprofessionals)
    //       .toPromise();
    //   });
  }
}
