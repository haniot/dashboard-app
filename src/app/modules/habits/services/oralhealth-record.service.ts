import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { OralHealthRecord, TeethBrushingFrequency, ToothType, LesionType } from '../models/oralhealth-record';

const mock = [
    {
        id: "5cc0be311f7cca39e6de1e7d",
        created_at: "2018-11-19T14:40:00Z",
        teeth_brushing_freq: TeethBrushingFrequency.none,
        teeth_lesions: [
            {
                "tooth_type": ToothType.deciduous_tooth,
                "lesion_type": LesionType.cavitated_lesion
            },
            {
                "tooth_type": ToothType.permanent_tooth,
                "lesion_type": LesionType.white_spot_lesion
            }
        ]
    },
    {
        id: "5cc0be311f7cca39e6de1e7d",
        created_at: "2018-11-19T14:40:00Z",
        teeth_brushing_freq: TeethBrushingFrequency.once,
        teeth_lesions: [
            {
                "tooth_type": ToothType.deciduous_tooth,
                "lesion_type": LesionType.white_spot_lesion
            },
            {
                "tooth_type": ToothType.permanent_tooth,
                "lesion_type": LesionType.white_spot_lesion
            }
        ]
    },
    {
        id: "5cc0be311f7cca39e6de1e7d",
        created_at: "2018-11-19T14:40:00Z",
        teeth_brushing_freq: TeethBrushingFrequency.three_more,
        teeth_lesions: [
            {
                "tooth_type": ToothType.deciduous_tooth,
                "lesion_type": LesionType.white_spot_lesion
            },
            {
                "tooth_type": ToothType.permanent_tooth,
                "lesion_type": LesionType.cavitated_lesion
            }
        ]
    }

];

@Injectable()
export class OralHealthRecordService {

    constructor(private http: HttpClient) { }


    getById(patientId: string, oralhealthRecordId: string, ): Promise<OralHealthRecord> {
        return this.http.get<any>(`${environment.api_url}/patients/${patientId}/oralhealthrecords/${oralhealthRecordId}`)
            .toPromise();
    }

    getAll(patientId: string, page?: number, limit?: number): Promise<OralHealthRecord[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        }

        const url = `${environment.api_url}/patients/${patientId}/oralhealthrecords`;
        return Promise.resolve(mock);
        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }
}
