import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { SleepHabitsRecord } from '../models/sleep';

@Injectable()
export class SleepRecordService {

  constructor(private http: HttpClient) { }


  getById(patientId: string, sleepRecordId: string, ): Promise<SleepHabitsRecord> {
    return this.http.get<any>(`${environment.api_url}/patients/${patientId}/sleephabits/${sleepRecordId}`)
      .toPromise();
  }

  getAll(patientId: string, page?: number, limit?: number): Promise<SleepHabitsRecord[]> {
    let myParams = new HttpParams();

    if (page) {
      myParams = myParams.append("page", String(page));
    }

    if (limit) {
      myParams = myParams.append("limit", String(limit));
    } else {
      myParams = myParams.append("limit", String(Number.MAX_SAFE_INTEGER));
    }

    const url = `${environment.api_url}/patients/${patientId}/sleephabits`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }
}
