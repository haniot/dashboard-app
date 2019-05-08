import { Evaluation } from './evaluation';

export enum Percentile {
    "P0.1",
    "P99.9",
    P3 = "P3",
    P85 = "P85",
    P97 = "P97"
}

export class NutritionalStatus {
    bmi: number;
    percentile: Percentile;
    classification: string;
}

export class OverWeightIndicator {
    waist_height_relation: number;
    classification: string;
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

export enum BloodPressurePercentile {
    pas5 = "pas5",
    pas10 = "pas10",
    pas25 = "pas25",
    pas50 = "pas50",
    pas75 = "pas75",
    pas90 = "pas90",
    pas95 = "pas95"
}

export class BloodGlucoseEvaluation {
    value: number;
    meal: MealType;
    classification: BloodGlucoseClassification;
    zones: Array<any>;
}

export enum BloodPressureClassification {
    normal = "normal",
    pre_hypertension = "pre_hypertension",
    arterial_hypertension_stage_1 = "arterial_hypertension_stage_1",
    arterial_hypertension_stage_2 = "arterial_hypertension_stage_2"
}
export class BloodPressureEvaluation {
    systolic: number;
    diastolic: number;
    systolic_percentile: BloodPressurePercentile;
    diastolic_percentile: BloodPressurePercentile;
    classification: BloodPressureClassification;
}
export class NutritionEvaluation extends Evaluation {

    nutritional_status: NutritionalStatus;
    overweight_indicator: OverWeightIndicator;
    heart_rate: HeartRateEvaluation;
    blood_glucose: BloodGlucoseEvaluation;
    blood_pressure: BloodPressureEvaluation;
    counseling: string;
}
