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

  getAllByUserId(userId: string, page?: number, limit?: number, search?: string): Promise<PilotStudy[]> {
    let myParams = new HttpParams();

    if (page) {
      myParams = myParams.append("page", String(page));
    }

    if (limit) {
      myParams = myParams.append("limit", String(limit));
    } else {
      myParams = myParams.append("limit", String(Number.MAX_SAFE_INTEGER));
    }

    if (search) {
      myParams = myParams.append("?name", '*' + search + '*');
    }


    const url = `${environment.api_url}/users/healthprofessionals/${userId}/pilotstudies`;
    /*
    * TODO: Verficar o tipo de usuário e modificar a url. Por exemplo, se for um 
    * healthprofessional: `${environment.api_url}/users/healthprofessionals/${userId}/pilotstudies`
    * patient: `${environment.api_url}/users/patients/${userId}/pilotstudies`
    */
    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }

  getAll(page?: number, limit?: number, search?: string): Promise<PilotStudy[]> {
    let myParams = new HttpParams();

    if (page) {
      myParams = myParams.append("page", String(page));
    }

    if (limit) {
      myParams = myParams.append("limit", String(limit));
    } else {
      myParams = myParams.append("limit", String(Number.MAX_SAFE_INTEGER));
    }

    if (search) {
      myParams = myParams.append("?name", '*' + search + '*');
    }

    myParams = myParams.append("sort", "+created_at");

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

  addHealthProfessionalsToPilotStudy(pilotStudyId: string, healthprofessinalId: string): Promise<PilotStudy> {
    return this.http.post<any>(`${environment.api_url}/pilotstudies/${pilotStudyId}/healthprofessionals/${healthprofessinalId}`, {})
      .toPromise();
  }

  dissociateHealthProfessionalsFromPilotStudy(pilotStudyId: string, healthprofessinalId: string): Promise<boolean> {
    return this.http.delete<any>(`${environment.api_url}/pilotstudies/${pilotStudyId}/healthprofessionals/${healthprofessinalId}`)
      .toPromise();
  }
}