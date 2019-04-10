import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { MedicalRecord } from '../models/medical-record';


@Injectable()
export class MedicalRecordService {

  constructor(private http: HttpClient) { }


  getById(patientId: string, medicalRecordId: string,): Promise<MedicalRecord> {
    return this.http.get<any>(`${environment.api_url}/patients/${patientId}/medicalrecords/${medicalRecordId}`)
      .toPromise();
  }

  getAll(patientId: string, page?: number, limit?: number): Promise<MedicalRecord[]> {
    let myParams = new HttpParams();

    if (page && limit) {
      myParams = new HttpParams()
        .set("page", String(page))
        .set("limit", String(limit))
        .set("sort", 'created_a');
    }

    const url = `${environment.api_url}/patients/${patientId}/medicalrecords`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }
}
