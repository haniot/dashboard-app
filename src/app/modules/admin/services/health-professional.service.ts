import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { HealthProfessional } from 'app/shared/shared-models/users.models';
@Injectable()

export class HealthProfessionalService {

  constructor(private http: HttpClient) { }


  getById(id: string): Promise<any> {
    return this.http.get<any>(`${environment.api_url}/users/healthprofessionals/${id}`)
      .toPromise();
  }

  getAll(page?: number, limit?: number): Promise<HealthProfessional[]> {
    let myParams = new HttpParams();
    let options = {};

    if (page && limit) {
      myParams.set("page", String(page));
      myParams.set("limit", String(limit));
      myParams.set("sort", 'created_a');
      options = { params: myParams };
    }

    const url = `${environment.api_url}/users/healthprofessionals`;

    return this.http.get<any>(url, options)
      .toPromise();

  }

  create(healthprofessionals: HealthProfessional): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/users/healthprofessionals`, healthprofessionals)
      .toPromise();
  }

  update(healthprofessionals: HealthProfessional): Promise<boolean> {
    return this.getById(healthprofessionals.id)
      .then(healthprofessionalsOld => {
        Object.keys(healthprofessionalsOld).forEach(key => {
          if (healthprofessionalsOld[key] == healthprofessionals[key] && key != 'id') {
            delete healthprofessionals[key];
          }
        });
        return this.http.patch<any>(`${environment.api_url}/users/healthprofessionals/${healthprofessionals.id}`, healthprofessionals)
          .toPromise();
      });
  }
}
