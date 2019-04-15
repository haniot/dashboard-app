import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PilotStudy } from '../models/pilot.study';
import { environment } from 'environments/environment';

@Injectable()
export class PilotStudyService {

  constructor(private http: HttpClient) { }


  getById(id: string): Promise<PilotStudy> {
    return this.http.get<any>(`${environment.api_url}/pilotstudies/${id}`)
      .toPromise();
  }

  getAllByUserId(userId: string, page?: number, limit?: number): Promise<PilotStudy[]> {
    let myParams = new HttpParams();

    if (page && limit) {
      myParams = new HttpParams()
        .set("page", String(page))
        .set("limit", String(limit))
        .set("sort", 'created_a');
    }

    const url = `${environment.api_url}/users/healthprofessionals/${userId}/pilotstudies`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }

  getAll(page?: number, limit?: number): Promise<PilotStudy[]> {
    let myParams = new HttpParams();

    if (page && limit) {
      myParams = new HttpParams()
        .set("page", String(page))
        .set("limit", String(limit))
        .set("sort", 'created_a');
    }

    const url = `${environment.api_url}/pilotstudies`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }

  create(pilotstudy: PilotStudy): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/pilotstudies`, pilotstudy)
      .toPromise();
  }

  update(pilotstudy: PilotStudy): Promise<boolean> {
    delete pilotstudy.health_professionals_id;
    return this.http.patch<any>(`${environment.api_url}/pilotstudies/${pilotstudy.id}`, pilotstudy)
          .toPromise();
    // const health_professionals_id = pilotstudy.health_professionals_id;
    // return this.getById(pilotstudy.id)
    //   .then(pilotstudyOld => {
    //     Object.keys(pilotstudyOld).forEach(key => {
    //       if (pilotstudyOld[key].toString() == pilotstudy[key].toString() && key != 'id' || key == 'health_professionals_id') {
    //         delete pilotstudy[key];
    //       }
    //     });
    //     if (Object.keys(pilotstudy).length == 1 && pilotstudy.id) {
    //       return Promise.resolve(true);
    //     }
    //     return this.http.patch<any>(`${environment.api_url}/pilotstudies/${pilotstudy.id}`, pilotstudy)
    //       .toPromise();
    //   });
  }

  remove(pilotstudyId: string): Promise<boolean> {
    return this.http.delete<any>(`${environment.api_url}/pilotstudies/${pilotstudyId}`)
      .toPromise();
  }

  /** Estudos piloto associados */

  getHealthProfessionalsByPilotStudyId(pilotStudyId: string) {
    return this.http.get<any>(`${environment.api_url}/pilotstudies/${pilotStudyId}/healthprofessionals`)
      .toPromise();
  }

  addHealthProfessionalsToPilotStudy(pilotStudyId: string, healthprofessinalId: string): Promise<PilotStudy>{
    return this.http.post<any>(`${environment.api_url}/pilotstudies/${pilotStudyId}/healthprofessionals/${healthprofessinalId}`, {})
      .toPromise();
  }

  dissociateHealthProfessionalsFromPilotStudy(pilotStudyId: string, healthprofessinalId: string): Promise<boolean> {
    return this.http.delete<any>(`${environment.api_url}/pilotstudies/${pilotStudyId}/healthprofessionals/${healthprofessinalId}`)
      .toPromise();
  }
}