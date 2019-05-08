import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { NutritionEvaluation, NutritionalStatus, OverWeightIndicator, HeartRateEvaluation, BloodGlucoseEvaluation, BloodPressureEvaluation, Percentile, BloodGlucoseClassification, BloodPressureClassification, BloodPressurePercentile } from '../models/nutrition-evaluation';
import { EvaluationStatus } from '../models/evaluation';
import { MealType } from 'app/modules/measurement/models/blood-glucose';
const nutritionalStatus = new NutritionalStatus();
nutritionalStatus.bmi = 15;
nutritionalStatus.classification = "Classificação";
nutritionalStatus.percentile = Percentile["P0.1"];

const overWeightIndicator = new OverWeightIndicator();
overWeightIndicator.classification = "Classificação";
overWeightIndicator.waist_height_relation = 55;

const heartRateEvaluation = new HeartRateEvaluation();
heartRateEvaluation.min = 15;
heartRateEvaluation.max = 85;
heartRateEvaluation.average = 50;
heartRateEvaluation.dataset = [
    {
        "value": 100,
        "timestamp": "2018-11-19T14:40:00Z"
    },
    {
        "value": 110,
        "timestamp": "2018-11-20T14:40:00Z"
    },
    {
        "value": 120,
        "timestamp": "2018-11-21T14:40:00Z"
    },
    {
        "value": 130,
        "timestamp": "2018-11-22T14:40:00Z"
    }
];

const bloodGlucoseEvaluation = new BloodGlucoseEvaluation();
bloodGlucoseEvaluation.classification = BloodGlucoseClassification.good;
bloodGlucoseEvaluation.meal = MealType.bedtime;
bloodGlucoseEvaluation.value = 55;
bloodGlucoseEvaluation.zones = [];

const bloodPressureEvaluation = new BloodPressureEvaluation();
bloodPressureEvaluation.classification = BloodPressureClassification.arterial_hypertension_stage_1;
bloodPressureEvaluation.systolic = 50;
bloodPressureEvaluation.systolic_percentile = BloodPressurePercentile.pas10;
bloodPressureEvaluation.diastolic = 50;
bloodPressureEvaluation.diastolic_percentile = BloodPressurePercentile.pas25;

const mock = [
    {
        id: "5cb4882751b5f21ba364ba6f",
        created_at: "2018-11-19T14:40:00Z",
        status: EvaluationStatus.incomplete,
        patient_id: "5cb4882751b5f21ba364ba6f",
        nutritional_status: nutritionalStatus,
        overweight_indicator: overWeightIndicator,
        heart_rate: heartRateEvaluation,
        blood_glucose: bloodGlucoseEvaluation,
        blood_pressure: bloodPressureEvaluation,
        counseling: "Coma mais vegetais!"
    },
    {
        id: "5cb4882751b5f21ba364ba6f",
        created_at: "2018-11-20T14:40:00Z",
        status: EvaluationStatus.complete,
        patient_id: "5cb4882751b5f21ba364ba6f",
        nutritional_status: nutritionalStatus,
        overweight_indicator: overWeightIndicator,
        heart_rate: heartRateEvaluation,
        blood_glucose: bloodGlucoseEvaluation,
        blood_pressure: bloodPressureEvaluation,
        counseling: "Coma mais vegetais!"
    }
];


@Injectable()
export class NutritionEvaluationService {

    constructor(private http: HttpClient) { }

    getAll(page?: number, limit?: number, search?: string): Promise<NutritionEvaluation[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        }

        if (search) {
            myParams = myParams.append("?search", "*" + search + "*");
        }

        const url = `${environment.api_url}/nutritional/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    getAllByPatient(patient_id: string, page?: number, limit?: number, search?: string): Promise<Array<NutritionEvaluation>> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        }

        if (search) {
            myParams = myParams.append("?search", "*" + search + "*");
        }

        const url = `${environment.api_url}/patients/${patient_id}/nutritional/evaluations`;
        return Promise.resolve(mock);
        // return this.http.get<any>(url, { params: myParams })
        //     .toPromise();
    }

    getAllByPilotstudy(pilostudy_id: string, page?: number, limit?: number, search?: string): Promise<NutritionEvaluation[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        }

        if (search) {
            myParams = myParams.append("?search", "*" + search + "*");
        }

        const url = `${environment.api_url}/pilotstudies/${pilostudy_id}/nutritional/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    getAllByHealthprofessional(healthprofessional_id: string, page?: number, limit?: number, search?: string)
        : Promise<NutritionEvaluation[]> {
        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append("page", String(page));
        }

        if (limit) {
            myParams = myParams.append("limit", String(limit));
        }

        if (search) {
            myParams = myParams.append("?search", "*" + search + "*");
        }

        const url = `${environment.api_url}/healthprofessionals/${healthprofessional_id}/nutritional/evaluations`;

        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    getById(patient_id: string, nutritionevaluation_id: string): Promise<NutritionEvaluation> {
        return Promise.resolve(mock[0]);
        // return this.http.get<any>(`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation_id}`)
        //     .toPromise();
    }

    update(patient_id: string, nutritionevaluation: NutritionEvaluation): Promise<NutritionEvaluation> {
        return this.http.patch<any>
            (`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation.id}`, nutritionevaluation)
            .toPromise();
    }

    remove(patient_id: string, nutritionevaluation_id: string): Promise<NutritionEvaluation> {
        return this.http.delete<any>
            (`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation_id}`)
            .toPromise();
    }

}
