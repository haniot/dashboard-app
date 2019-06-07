import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {environment} from 'environments/environment';
import {Patient} from 'app/modules/patient/models/patient';
import {PilotStudy} from 'app/modules/pilot-study/models/pilot.study';
import {AuthService} from 'app/security/auth/services/auth.service';
import {Evaluation} from "../../evaluation/models/evaluation";
import {IMeasurement} from "../../measurement/models/measurement";
import {Unit} from "../models/unit";

@Injectable()
export class DashboardService {

    cacheListpilots: Array<PilotStudy>;
    cacheListpatients: Array<Patient>;
    listNumberPatientsForEachStudy: Array<Unit>;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.cacheListpilots = new Array<PilotStudy>();
        this.cacheListpatients = new Array<Patient>();
        this.listNumberPatientsForEachStudy = new Array<Unit>();
    }

    async getInfoByUser(userId: string)
        : Promise<{ studiesTotal: number, patientsTotal: number }> {

        this.cacheListpilots = new Array<PilotStudy>();
        this.cacheListpatients = new Array<Patient>();
        this.listNumberPatientsForEachStudy = new Array<Unit>();

        let patientsTotal;
        let studiesTotal;
        // let measurementsTotal;
        // let evaluationsTotal;

        studiesTotal = await this.getNumberOfStudies(userId);

        patientsTotal = await this.getNumberOfPatients();

        // measurementsTotal = await this.getNumberOfMeasurements();

        // evaluationsTotal = await this.getNumberOfEvaluations(userId);

        return {
            studiesTotal: studiesTotal,
            patientsTotal: patientsTotal
        };
    }

    getNumberPatientsForEachStudy(): Array<Unit> {
        return this.listNumberPatientsForEachStudy;
    }

    async getPatientsAndWeigth(pilotstudy_id: string): Promise<Array<Unit>> {
        const patientsAndWeigth = new Array<Unit>();
        const patients = await this.getAllPatients(pilotstudy_id);
        for (const index in patients) {
            if (patients.hasOwnProperty(index)) {
                const patient = patients[index];
                try {
                    const measurements: Array<IMeasurement> = await this.getAllMeasurements(patient.id);
                    patientsAndWeigth.push({
                        namePatient: patient.name,
                        value: measurements[0].value
                    })
                    ;
                } catch (e) {

                }
            }
        }
        return patientsAndWeigth;
    }

    getListStudy(): Array<PilotStudy> {
        return this.cacheListpilots;
    }


    getNumberOfStudies(userId: string): Promise<number> {
        return this.getAllStudiesByUserId(userId)
            .then(pilotstudies => {
                this.cacheListpilots = pilotstudies;
                return Promise.resolve(pilotstudies.length);
            })
            .catch(errorResponse => {
                // console.log('Não foi possível carregar a quantidade de estudos! ', errorResponse.error);
                return Promise.resolve(0);
            });
    }

    getNumberOfEvaluations(userId: string): Promise<number> {
        return this.getAllEvaluations(userId)
            .then(evaluations => {
                return Promise.resolve(evaluations.length);
            })
            .catch(errorResponse => {
                // console.log('Não foi possível carregar a quantidade de avaliações! ', errorResponse.error);
                return Promise.resolve(0);
            });
    }

    async getNumberOfPatients(): Promise<number> {

        let totalOfPatients = 0;
        for (const index in this.cacheListpilots) {
            if (this.cacheListpilots.hasOwnProperty(index)) {
                const pilot = this.cacheListpilots[index];
                try {
                    const listOfPatients: Array<Patient> = await this.getAllPatients(pilot.id);
                    this.listNumberPatientsForEachStudy.push({namePatient: pilot.name, value: listOfPatients.length});
                    this.cacheListpatients = this.cacheListpatients.concat(listOfPatients);
                    totalOfPatients += listOfPatients.length;
                } catch (e) {

                }
            }
        }
        return totalOfPatients;
    }

    async getNumberOfMeasurements(): Promise<number> {

        let totalOfMeasurements = 0;
        for (const index in this.cacheListpatients) {
            if (this.cacheListpatients.hasOwnProperty(index)) {
                const patient = this.cacheListpatients[index];
                try {
                    const listOfMeasurements: Array<IMeasurement> = await this.getAllMeasurements(patient.id);
                    totalOfMeasurements += listOfMeasurements.length;
                } catch (e) {

                }
            }
        }
        return totalOfMeasurements;
    }

    /**
     * get all studies from a userId
     */
    getAllStudiesByUserId(userId: string, page?: number, limit?: number): Promise<PilotStudy[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        }

        let url = `${environment.api_url}/users/healthprofessionals/${userId}/pilotstudies`;

        if (this.authService.decodeToken().sub_type === 'admin') {
            url = `${environment.api_url}/pilotstudies`;
        }

        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }

    /**
     * get all patients from a pilotstudyId
     */
    getAllPatients(pilotstudyId: string, page?: number, limit?: number): Promise<Patient[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        }

        const url = `${environment.api_url}/pilotstudies/${pilotstudyId}/patients`;

        return this.http.get<any>(url, {params: myParams})
            .toPromise();
    }

    /**
     * get all evaluations from a healthprofessional
     */
    private getAllEvaluations(healthprofessional_id: string): Promise<Evaluation[]> {

        const url = `${environment.api_url}/healthprofessionals/${healthprofessional_id}/nutritional/evaluations`;

        return this.http.get<any>(url)
            .toPromise();
    }

    /**
     * get all measurements from a patient
     */
    private getAllMeasurements(patient_id: string): Promise<IMeasurement[]> {

        const url = `${environment.api_url}/users/${patient_id}/measurements`;

        return this.http.get<any>(url)
            .toPromise();
    }

    /**
     * get all measurements from a patient
     */
    private getAllMeasurementsByType(patient_id: string, typeMeasurement: string): Promise<IMeasurement[]> {

        const url = `${environment.api_url}/users/${patient_id}/measurements?type=${typeMeasurement}`;

        return this.http.get<any>(url)
            .toPromise();
    }

}
