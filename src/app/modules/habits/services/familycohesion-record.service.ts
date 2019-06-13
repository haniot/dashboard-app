import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {environment} from 'environments/environment';
import {FamilyCohesionRecord} from '../models/familycohesion-record';

@Injectable()
export class FamilyCohesionRecordService {

  constructor(private http: HttpClient) { }


  getById(patientId: string, familycohesionRecordId: string): Promise<FamilyCohesionRecord> {
    return this.http.get<any>(`${environment.api_url}/patients/${patientId}/familycohesionrecords/${familycohesionRecordId}`)
      .toPromise();
  }

  getAll(patientId: string, page?: number, limit?: number): Promise<FamilyCohesionRecord[]> {
    let myParams = new HttpParams();

    if (page) {
      myParams = myParams.append("page", String(page));
    }

    if (limit) {
      myParams = myParams.append("limit", String(limit));
    } else {
      myParams = myParams.append("limit", String(Number.MAX_SAFE_INTEGER));
    }

    const url = `${environment.api_url}/patients/${patientId}/familycohesionrecords`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }
}
