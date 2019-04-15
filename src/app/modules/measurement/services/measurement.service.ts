import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { IMeasurement } from '../models/measurement';

@Injectable()
export class MeasurementService {

  constructor(private http: HttpClient) { }


  getById(measurementId: string,): Promise<IMeasurement> {
    return this.http.get<any>(`${environment.api_url}/measurements/${measurementId}`)
      .toPromise();
  }

  getAll(page?: number, limit?: number): Promise<IMeasurement[]> {
    let myParams = new HttpParams();

    if (page && limit) {
      myParams = new HttpParams()
        .set("page", String(page))
        .set("limit", String(limit))
        .set("sort", 'created_a');
    }

    const url = `${environment.api_url}/measurements`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }
}
