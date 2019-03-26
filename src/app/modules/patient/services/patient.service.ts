import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Patient } from '../models/patient';

@Injectable()
export class PatientService {

  constructor(private http: HttpClient) { }


  getById(pilotstudyId: string, patientId: string): Promise<Patient> {
    return this.http.get<any>(`${environment.api_url}/pilotstudies/${pilotstudyId}/patients/${patientId}`)
      .toPromise();
  }

  getAll(pilotstudyId: string, page?: number, limit?: number): Promise<Patient[]> {
    let myParams = new HttpParams();

    if (page && limit) {
      myParams = new HttpParams()
        .set("page", String(page))
        .set("limit", String(limit))
        .set("sort", 'created_a');
    }

    const url = `${environment.api_url}/pilotstudies/${pilotstudyId}/patients`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }

  create(pilotstudyId: string, patient: Patient): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/pilotstudies/${pilotstudyId}/patients`, patient)
      .toPromise();
  }

  update(pilotstudyId: string, patient: Patient): Promise<boolean> {
    return this.getById(pilotstudyId, patient.id)
      .then(patientOld => {
        Object.keys(patientOld).forEach(key => {
          if (patientOld[key] == patient[key] && key != 'id') {
            delete patient[key];
          }
        });
        return this.http.patch<any>(`${environment.api_url}/pilotstudies/${pilotstudyId}/patients/${patient.id}`, patient)
          .toPromise();
      });
  }

  remove(pilotstudyId: string, patientId: string): Promise<boolean> {
    return this.http.delete<any>(`${environment.api_url}/pilotstudies/${pilotstudyId}/patients/${patientId}`)
      .toPromise();
  }
}
