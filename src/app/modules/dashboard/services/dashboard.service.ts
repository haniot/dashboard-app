import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Patient } from 'app/modules/patient/models/patient';
import { PilotStudy } from 'app/modules/pilot-study/models/pilot.study';


@Injectable()
export class DashboardService {

    constructor(
        private http: HttpClient
    ) { }


    getNumberOfStudies(userId: string): Promise<number> {
        return this.getAllStudiesByUserId(userId)
            .then(pilotstudies => {
                return Promise.resolve(pilotstudies.length);
            })
            .catch(errorResponse => {
                //console.log('Não foi possível carregar a quantidade de estudos! ', errorResponse.error);
                return Promise.resolve(0);
            });
    }

    /**
     * get all studies for userId
     */
    private getAllStudiesByUserId(userId: string): Promise<PilotStudy[]> {

        const url = `${environment.api_url}/users/healthprofessionals/${userId}/pilotstudies`;

        return this.http.get<any>(url)
            .toPromise();
    }

    /**
     * get all patients for pilotstudyId
     */
    private getAllPatients(pilotstudyId: string): Promise<Patient[]> {

        const url = `${environment.api_url}/pilotstudies/${pilotstudyId}/patients`;

        return this.http.get<any>(url)
            .toPromise();
    }

}
