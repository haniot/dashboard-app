import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { FamilyCohesionRecord, Frequency } from '../models/familycohesion-record';

const mock = [
  {
    id: "5cc0be311f7cca39e6de1e7d",
    created_at: "2018-11-19T14:40:00Z",
    family_mutual_aid_freq: Frequency.almost_aways,
    friendship_approval_freq: Frequency.almost_aways,
    family_only_task_freq: Frequency.almost_aways,
    family_only_preference_freq: Frequency.almost_aways,
    free_time_together_freq: Frequency.almost_aways,
    family_proximity_perception_freq: Frequency.almost_aways,
    all_family_tasks_freq: Frequency.almost_aways,
    family_tasks_opportunity_freq: Frequency.almost_aways,
    family_decision_support_freq: Frequency.almost_aways,
    family_union_relevance_freq: Frequency.almost_aways,
    family_cohesion_result: 25
  },
  {
    id: "5cc0be311f7cca39e6de1e7d",
    created_at: "2018-11-19T14:40:00Z",
    family_mutual_aid_freq: Frequency.almost_aways,
    friendship_approval_freq: Frequency.almost_aways,
    family_only_task_freq: Frequency.almost_aways,
    family_only_preference_freq: Frequency.almost_never,
    free_time_together_freq: Frequency.almost_aways,
    family_proximity_perception_freq: Frequency.rarely,
    all_family_tasks_freq: Frequency.almost_aways,
    family_tasks_opportunity_freq: Frequency.sometimes,
    family_decision_support_freq: Frequency.often,
    family_union_relevance_freq: Frequency.almost_never,
    family_cohesion_result: 30

  }
]

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

    return Promise.resolve(mock);
    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }
}
