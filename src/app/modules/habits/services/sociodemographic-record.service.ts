import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { SocioDemographicRecord, CorAndRace, MotherSchoolarity } from '../models/sociodemographic-record';

const mock = [
  {
    id: "5cc0be311f7cca39e6de1e7d",
    created_at: "2018-11-19T14:40:00Z",
    color_race: CorAndRace.white,
    mother_schoolarity: MotherSchoolarity.unlettered,
    people_in_home: 5
  },
  {
    id: "5cc0be311f7cca39e6de1e7d",
    created_at: "2018-11-19T14:40:00Z",
    color_race: CorAndRace.parda,
    mother_schoolarity: MotherSchoolarity.elementary_4_to_7,
    people_in_home: 5
  },
  {
    id: "5cc0be311f7cca39e6de1e7d",
    created_at: "2018-11-19T14:40:00Z",
    color_race: CorAndRace.yellow,
    mother_schoolarity: MotherSchoolarity.elementary_complete,
    people_in_home: 5
  },
  {
    id: "5cc0be311f7cca39e6de1e7d",
    created_at: "2018-11-19T14:40:00Z",
    color_race: CorAndRace.black,
    mother_schoolarity: MotherSchoolarity.elementary_1_to_3,
    people_in_home: 5
  }
]

@Injectable()
export class SocioDemographicRecordService {

  constructor(private http: HttpClient) { }


  getById(patientId: string, sociodemographicRecordId: string, ): Promise<SocioDemographicRecord> {
    return this.http.get<any>(`${environment.api_url}/patients/${patientId}/sociodemographicrecords/${sociodemographicRecordId}`)
      .toPromise();
  }

  getAll(patientId: string, page?: number, limit?: number): Promise<SocioDemographicRecord[]> {
    let myParams = new HttpParams();

    if (page) {
      myParams = myParams.append("page", String(page));
    }

    if (limit) {
      myParams = myParams.append("limit", String(limit));
    }

    const url = `${environment.api_url}/patients/${patientId}/sociodemographicrecords`;

    return Promise.resolve(mock);
    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }
}
