import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PilotStudy} from '../models/pilot.study';
import {environment} from 'environments/environment';
import {OdontologicEvaluation} from "../../evaluation/models/odontologic-evaluation";
import {DateRange} from "../models/range-date";

const dental = new OdontologicEvaluation();
dental.total_patients = 20;
dental.created_at = "2018-11-19T14:40:00Z";
dental.file_csv = "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/test.csv";
dental.file_xls = "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/test.csv";

const dental2 = new OdontologicEvaluation();
dental2.total_patients = 20;
dental2.created_at = "2018-11-19T14:40:00Z";
dental2.file_csv = "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/test.csv";
dental2.file_xls = "https://s3.amazonaws.com/assets.datacamp.com/blog_assets/test.csv";

@Injectable()
export class PilotStudyService {

    constructor(private http: HttpClient) {
    }


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
        * TODO: Verficar o tipo de usuário e modificar a url. Por exemplo, se for um:
        * healthprofessional: `${environment.api_url}/users/healthprofessionals/${userId}/pilotstudies`
        * patient: `${environment.api_url}/users/patients/${userId}/pilotstudies`
        */

        return this.http.get<any>(url, {params: myParams})
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

        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }

    getAllFiles(pilotstudy_id: string, page?: number, limit?: number, search?: DateRange): Promise<OdontologicEvaluation[]> {
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

            myParams = myParams.append("created_at", 'gte:' + search.begin.toISOString());

            myParams = myParams.append("created_at", 'lte:' + search.end.toISOString());


        }
        // timestamp=gte:${date_start}&timestamp=lte:${date_end}`

        myParams = myParams.append("sort", "+created_at");

        const url = `${environment.api_url}/pilotstudies/${pilotstudy_id}/odontological/evaluations`;
        // return Promise.resolve([dental, dental2]);
        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }

    removeFile(pilotstudyId: string, file_id): Promise<boolean> {
        return this.http.delete<any>(`${environment.api_url}/pilotstudies/${pilotstudyId}/odontological/evaluations/${file_id}`)
            .toPromise();
    }

    generateNewFile(pilotStudy: PilotStudy, health_professional_id: string): Promise<OdontologicEvaluation> {

        const body = {pilotstudy: pilotStudy, health_professional_id: health_professional_id}

        // return Promise.resolve(dental);
        return this.http.post<any>(`${environment.api_url}/pilotstudies/${pilotStudy.id}/odontological/evaluations`, body)
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
