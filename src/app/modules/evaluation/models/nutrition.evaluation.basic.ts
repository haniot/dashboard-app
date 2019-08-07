import { PatientBasic } from '../../patient/models/patient'
import { EvaluationStatus } from './nutrition-evaluation'

export class NutritionEvaluationBasic {
    id: string;
    created_at: string;
    status: EvaluationStatus;
    patient: PatientBasic;
    nutritional_status: string;
    overweight_indicator: string;
    taylor_cut_point: string;
    blood_glucose: string;
    blood_pressure: string;

    constructor() {
        this.id = '';
        this.created_at = '';
        this.patient = new PatientBasic();
        this.nutritional_status = '';
        this.overweight_indicator = '';
        this.taylor_cut_point = '';
        this.blood_glucose = '';
        this.blood_pressure = '';
    }
}
