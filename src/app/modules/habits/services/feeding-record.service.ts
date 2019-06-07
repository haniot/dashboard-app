import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { FeedingHabitsRecord } from '../models/feeding';

@Injectable()
export class FeedingRecordService {

  constructor(private http: HttpClient) { }


  getById(patientId: string, feedingRecordId: string, ): Promise<FeedingHabitsRecord> {
    return this.http.get<any>(`${environment.api_url}/patients/${patientId}/feedinghabitsrecords/${feedingRecordId}`)
      .toPromise();
  }

  getAll(patientId: string, page?: number, limit?: number): Promise<FeedingHabitsRecord[]> {
    let myParams = new HttpParams();

    if (page) {
      myParams = myParams.append("page", String(page));
    }

    if (limit) {
      myParams = myParams.append("limit", String(limit));
    } else {
      myParams = myParams.append("limit", String(Number.MAX_SAFE_INTEGER));
    }

    const url = `${environment.api_url}/patients/${patientId}/feedinghabitsrecords`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }
}
