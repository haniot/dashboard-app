import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PilotStudy } from '../models/pilot.study';
import { environment } from 'environments/environment';

@Injectable()
export class PilotStudyService {

  constructor(private http: HttpClient) { }


  getById(id: string): Promise<any> {
    return this.http.get<any>(`${environment.api_url}/pilotstudies/${id}`)
      .toPromise();
  }

  getAll(page?: number, limit?: number): Promise<PilotStudy[]> {
    let myParams = new HttpParams();
    
    if(page && limit){
      myParams = new HttpParams()
      .set("page", String(page))
      .set("limit", String(limit))
      .set("sort", 'created_a');
    } 

    const url = `${environment.api_url}/pilotstudies`;

    return this.http.get<any>(url, {params: myParams})
      .toPromise();
  }

  create(pilotstudy: PilotStudy): Promise<boolean> {
    return this.http.post<any>(`${environment.api_url}/pilotstudies`, pilotstudy)
      .toPromise();
  }

  update(pilotstudy: PilotStudy): Promise<boolean> {
    return this.http.patch<any>(`${environment.api_url}/pilotstudies/${pilotstudy.id}`, pilotstudy)
      .toPromise();
  }

  remove(pilotstudyId: string): Promise<boolean> {
    return this.http.delete<any>(`${environment.api_url}/pilotstudies/${pilotstudyId}`)
      .toPromise();
  }

  getHealthProfessionalsByPilotStudyId(pilotStudyId: string) {
    return this.http.get<any>(`${environment.api_url}/pilotstudies/${pilotStudyId}/healthprofessionals`)
      .toPromise();
  }
}
