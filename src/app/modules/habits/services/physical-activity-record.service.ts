import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { SleepHabitsRecord } from '../models/sleep';
import { PhysicalActivityHabitsRecord } from '../models/physicalActivity';



@Injectable()
export class PhysicalActivityRecordService {

  constructor(private http: HttpClient) { }


  getById(patientId: string, physicalActivityRecordId: string,): Promise<PhysicalActivityHabitsRecord> {
    return this.http.get<any>(`${environment.api_url}/patients/${patientId}/physicalactivityhabits/${physicalActivityRecordId}`)
      .toPromise();
  }

  getAll(patientId: string, page?: number, limit?: number): Promise<PhysicalActivityHabitsRecord[]> {
    let myParams = new HttpParams();

    if (page && limit) {
      myParams = new HttpParams()
        .set("page", String(page))
        .set("limit", String(limit))
        .set("sort", 'created_a');
    }

    const url = `${environment.api_url}/patients/${patientId}/physicalactivityhabits`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }
}
