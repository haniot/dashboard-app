import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { IMeasurement, Measurement } from '../models/measurement';
import { BloodPressure } from '../models/blood-pressure';
import { HeartRate } from '../models/heart-rate';
@Injectable()
export class MeasurementService {

  constructor(private http: HttpClient) { }

  getAll(page?: number, limit?: number): Promise<IMeasurement[]> {
    let myParams = new HttpParams();

    if (page) {
      myParams = myParams.append("page", String(page));
    }

    if (limit) {
      myParams = myParams.append("limit", String(limit));
    } else {
      myParams = myParams.append("limit", "100");
    }

    const url = `${environment.api_url}/measurements`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }

  getAllByUser(userId: string): Promise<Array<IMeasurement | BloodPressure | HeartRate> | Array<any>> {
    let myParams = new HttpParams();

    myParams = myParams.append("limit", "100");

    return this.http.get<any>(`${environment.api_url}/users/${userId}/measurements`, { params: myParams })
      .toPromise();
  }

  create(userId: string, measurement: Measurement): Promise<IMeasurement> {
    return this.http.post<any>(`${environment.api_url}/users/${userId}/measurements`, measurement)
      .toPromise();
  }

  getById(userId: string, measurementId: string): Promise<IMeasurement> {
    return this.http.get<any>(`${environment.api_url}/users/${userId}/measurements/${measurementId}`)
      .toPromise();
  }

  remove(userId: string, measurementId: string): Promise<IMeasurement> {
    return this.http.delete<any>(`${environment.api_url}/users/${userId}/measurements/${measurementId}`)
      .toPromise();
  }

}
