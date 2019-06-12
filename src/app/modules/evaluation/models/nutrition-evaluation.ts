import {Evaluation, EvaluationStatus, ICounseling} from './evaluation';
import {IMeasurement} from 'app/modules/measurement/models/measurement';
import {HeartRate} from 'app/modules/measurement/models/heart-rate';
import {BloodPressure} from 'app/modules/measurement/models/blood-pressure';
import {PhysicalActivityHabitsRecord} from 'app/modules/habits/models/physicalActivity';
import {FeedingHabitsRecord} from 'app/modules/habits/models/feeding';
import {MedicalRecord} from 'app/modules/habits/models/medical-record';
import {Weight} from 'app/modules/measurement/models/wieght';
import {Patient} from "../../patient/models/patient";
import {SleepHabitsRecord} from "../../habits/models/sleep";

export enum NutritionalStatusPercentile {
    p01 = "p01",
    p3 = "p3",
    p85 = "p85",
    p97 = "p97",
    p999 = "p999",
    undefined = "undefined"
}

export enum NutritionClassification {
    accentuated_thinness = "accentuated_thinness",
    thinness = "thinness",
    eutrophy = "eutrophy",
    overweight = "overweight",
    obesity = "obesity",
    severe_obesity = "severe_obesity"
}

export class NutritionalStatus {
    height: number;
    weight: number;
    bmi: number;
    percentile: NutritionalStatusPercentile;
    classification: NutritionClassification;
}

export enum OverWeightClassification {
    normal = "normal",
    overweight_obesity_risk = "overweight_obesity_risk"
}

export class OverWeightIndicator {
    waist_circumference: number;
    height: number;
    waist_height_relation: number;
    classification: OverWeightClassification;
}

class DataSet {
    value: number;
    timestamp: string;
}

export class HeartRateEvaluation {
    min: number;
    max: number;
    average: number;
    dataset: Array<DataSet>;
}

enum MealType {
    preprandial = "preprandial",
    postprandial = "postprandial",
    fasting = "fasting",
    casual = "casual",
    bedtime = "bedtime"
}

export enum BloodGlucoseClassification {
    good = "good",
    great = "great",
    undefined = "undefined"
}

export enum BloodPressurePercentileSystolic {
    pas5 = "pas5",
    pas10 = "pas10",
    pas25 = "pas25",
    pas50 = "pas50",
    pas75 = "pas75",
    pas90 = "pas90",
    pas95 = "pas95",
    undefined = "undefined"
}

export enum BloodPressurePercentileDiastolic {
    pad5 = "pad5",
    pad10 = "pad10",
    pad25 = "pad25",
    pad50 = "pad50",
    pad75 = "pad75",
    pad90 = "pad90",
    pad95 = "pad95",
    undefined = "undefined"
}

export interface IZoneBloodGlucose {
    good: { min: number, max: number };
    great: { min: number, max: number }
}

export interface IZoneMeal {
    [key: string]: IZoneBloodGlucose
}

export class BloodGlucoseEvaluation {
    value: number;
    meal: MealType;
    classification: BloodGlucoseClassification;
    zones: Array<IZoneMeal>;
}

export enum BloodPressureClassification {
    normal = "normal",
    borderline = "borderline",
    hypertension_stage_1 = "hypertension_stage_1",
    hypertension_stage_2 = "hypertension_stage_2",
    undefined = "undefined"
}

export class BloodPressureEvaluation {
    systolic: number;
    diastolic: number;
    systolic_percentile: BloodPressurePercentileSystolic;
    diastolic_percentile: BloodPressurePercentileDiastolic;
    classification: BloodPressureClassification;
}


export class NutritionalCouncil {
    bmi_whr: Array<string>;
    glycemia: Array<string>;
    blood_pressure: Array<string>;

    constructor() {
        this.bmi_whr = new Array<string>();
        this.glycemia = new Array<string>();
        this.blood_pressure = new Array<string>();
    }
}

export class NutritionalCounseling implements ICounseling {
    suggested: NutritionalCouncil;
    definitive: NutritionalCouncil;
}

export enum ClassificationTaylorCutPoint {
    normal = "normal",
    out_of_normality = "out_of_normality"
}

export class TaylorCutPoint {
    waist_circumference: number;
    classification: ClassificationTaylorCutPoint;
}

export class NutritionEvaluation extends Evaluation {
    status: EvaluationStatus;
    patient: Patient;
    counseling: ICounseling;
    nutritional_status: NutritionalStatus;
    overweight_indicator: OverWeightIndicator;
    taylor_cut_point: TaylorCutPoint;
    heart_rate: HeartRateEvaluation;
    blood_glucose: BloodGlucoseEvaluation;
    blood_pressure: BloodPressureEvaluation;
    measurements: Array<IMeasurement | BloodPressure | HeartRate | Weight>;
    physical_activity_habits: PhysicalActivityHabitsRecord;
    feeding_habits_record: FeedingHabitsRecord;
    medical_record: MedicalRecord
    sleep_habit: SleepHabitsRecord

    constructor() {
        super();
    }
}
