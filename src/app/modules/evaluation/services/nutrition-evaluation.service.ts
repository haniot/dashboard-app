import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import {
    NutritionEvaluation,
    NutritionalStatus,
    OverWeightIndicator,
    HeartRateEvaluation,
    BloodGlucoseEvaluation,
    BloodPressureEvaluation,
    Percentile,
    BloodGlucoseClassification,
    BloodPressureClassification,
    BloodPressurePercentile,
    NutritionClassification,
    OverWeightClassification,
    NutritionalCouncil
} from '../models/nutrition-evaluation';
import { EvaluationStatus } from '../models/evaluation';
import { MealType, BloodGlucose } from 'app/modules/measurement/models/blood-glucose';
import { IMeasurement, MeasurementType, Measurement } from 'app/modules/measurement/models/measurement';
import { PhysicalActivityHabitsRecord, ActivityFrequency } from 'app/modules/habits/models/physicalActivity';
import {
    FeedingHabitsRecord,
    WeeklyFrequency,
    QuantityWaterGlass,
    Breastfeeding,
    FoodAllergy,
    Breakfast
} from 'app/modules/habits/models/feeding';
import { MedicalRecord } from 'app/modules/habits/models/medical-record';
import { HeartRate } from 'app/modules/measurement/models/heart-rate';
import { BloodPressure } from 'app/modules/measurement/models/blood-pressure';
import { Weight, Fat } from 'app/modules/measurement/models/wieght';

const nutritionalStatus = new NutritionalStatus();
nutritionalStatus.height = 160;
nutritionalStatus.weight = 65;
nutritionalStatus.bmi = 15;
nutritionalStatus.percentile = Percentile.p01;
nutritionalStatus.classification = NutritionClassification.accentuated_thinness;

const overWeightIndicator = new OverWeightIndicator();
overWeightIndicator.waist_circumference = 75;
overWeightIndicator.height = 160;
overWeightIndicator.waist_height_relation = 55;
overWeightIndicator.classification = OverWeightClassification.overweight_obesity_risk;

const heartRateEvaluation = new HeartRateEvaluation();
heartRateEvaluation.min = 55;
heartRateEvaluation.max = 130;
heartRateEvaluation.average = 62;
heartRateEvaluation.dataset = [
    {
        "value": 100,
        "timestamp": "2018-11-18T14:40:00Z"
    },
    {
        "value": 70,
        "timestamp": "2018-11-19T14:40:00Z"
    },
    {
        "value": 120,
        "timestamp": "2018-11-21T14:40:00Z"
    },
    {
        "value": 55,
        "timestamp": "2018-11-22T14:40:00Z"
    },
    {
        "value": 80,
        "timestamp": "2018-11-23T14:40:00Z"
    },
    {
        "value": 130,
        "timestamp": "2018-11-24T14:40:00Z"
    }
];

const bloodGlucoseEvaluation = new BloodGlucoseEvaluation();
bloodGlucoseEvaluation.value = 55;
bloodGlucoseEvaluation.meal = MealType.bedtime;
bloodGlucoseEvaluation.classification = BloodGlucoseClassification.good;
bloodGlucoseEvaluation.zones = [
    {
        "prepandial": {
            "good": {
                "min": 65,
                "max": 100
            },
            "great": {
                "min": 90,
                "max": 145
            }
        },
        "postprandial": {
            "good": {
                "min": 80,
                "max": 126
            },
            "great": {
                "min": 90,
                "max": 180
            }
        },
        "bedtime": {
            "good": {
                "min": 80,
                "max": 126
            },
            "great": {
                "min": 90,
                "max": 180
            }
        },
        "glycated_hemoglobin": {
            "good": {
                "min": 4.5,
                "max": 6.5
            },
            "great": {
                "min": 5.7,
                "max": 7.5
            }
        }
    }
];

const bloodPressureEvaluation = new BloodPressureEvaluation();
bloodPressureEvaluation.systolic = 50;
bloodPressureEvaluation.diastolic = 50;
bloodPressureEvaluation.systolic_percentile = BloodPressurePercentile.pas10;
bloodPressureEvaluation.diastolic_percentile = BloodPressurePercentile.pas25;
bloodPressureEvaluation.classification = BloodPressureClassification.arterial_hypertension_stage_1;

const m1 = new BloodGlucose();
m1.id = "5cb488278cf5f9e6760c14ed";
m1.value = 99;
m1.unit = "mg/dl";
m1.meal = MealType.preprandial;
m1.type = MeasurementType.blood_glucose;
m1.timestamp = "2018-11-19T14:40:00Z";
m1.user_id = "5a62be07d6f33400146c9b61";
m1.device_id = "5ca790f77aefffa37a17b605";

const fat = new Fat();
fat.value = 62;
fat.unit = "%";

const m2 = new Weight();
m2.id = "5cb488278cf5f9e6760c14ed";
m2.value = 65;
m2.unit = "Kg";
m2.fat = fat
m2.type = MeasurementType.weight;
m2.timestamp = "2018-11-19T14:40:00Z";
m2.user_id = "5a62be07d6f33400146c9b61";
m2.device_id = "5ca790f77aefffa37a17b605";

const Measurements: Array<IMeasurement | BloodGlucose | BloodPressure | HeartRate | Weight> = [
    m1,
    m2
]

const PhysicalActivityHabitsLocal: PhysicalActivityHabitsRecord = {
    "id": "5cb488278cf5f9e6760c14ed",
    "created_at": "2018-11-19T14:40:00Z",
    "school_activity_freq": ActivityFrequency.four_more_per_week,
    "weekly_activities": [
        "run",
        "swim",
        "soccer",
        "basketball",
        "athletics"
    ]
}
const FeedingHabitsRecordLocal: FeedingHabitsRecord = {
    "id": "5cb488278cf5f9e6760c14ed",
    "created_at": "2018-11-19T14:40:00Z",
    "weekly_feeding_habits": [
        {
            "food": "soda",
            "seven_days_freq": WeeklyFrequency.all_days
        },
        {
            "food": "fried",
            "seven_days_freq": WeeklyFrequency.all_days
        },
        {
            "food": "fruits",
            "seven_days_freq": WeeklyFrequency.all_days
        }
    ],
    "daily_water_glasses": QuantityWaterGlass.five_more,
    "six_month_breast_feeding": Breastfeeding.complementary,
    "food_allergy_intolerance": [
        FoodAllergy.gluten,
        FoodAllergy.egg,
        FoodAllergy.dye
    ],
    "breakfast_daily_frequency": Breakfast.everyday
}
const MedicalRecordLocal: MedicalRecord = {
    "id": "5cb488278cf5f9e6760c14ed",
    "created_at": "2018-11-19T14:40:00Z",
    "chronic_diseases": [
        {
            "type": "hypertension",
            "disease_history": "yes"
        },
        {
            "type": "diabetes",
            "disease_history": "yes"
        }
    ]
}

const mock: Array<NutritionEvaluation> = [
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
        measurements: Measurements,
        physical_activity_habits: PhysicalActivityHabitsLocal,
        feeding_habits_record: FeedingHabitsRecordLocal,
        medical_record: MedicalRecordLocal,
        counselings: {
            "suggested": {
                "bmi_whr": [
                    "Realize de 5 a 6 refeições por dia (café da manhã,lanche da manhã, almoço, lanche da tarde, jantar e lanche da noite). Mastigar bem os alimentos.",
                    "Preparar pratos coloridos e diversificados para estimular o apetite.",
                    "Adicione uma colher de sopa de azeite de oliva extra virgem no almoço e no jantar."
                ],
                "glycemia": [
                    "Alimentação balanceada, utilizar carboidratos ricos em fibras e que forneçam energia lentamente como raízes e cereais integrais em pequenas quantidades.",
                    "Preferir água ao invés de refrigerantes, que não tem valor nutritivo e aumenta a concentração de açúcar no sangue.",
                    "Priorizar os vegetais (verduras e legumes) nas principais refeições."
                ],
                "blood_pressure": [
                    "Cortar o consumo excessivo de sal. O ideal é usar no máximo uma colher rasa de chá por pessoa/dia. Os pais sempre devem dar o exemplo.",
                    "A hidratação merece sempre atenção especial. Crianças e adolescentes devem consumir cerca de um litro e meio de água ao longo do dia."
                ]
            },
            "definitive": {
                "bmi_whr": [
                    "Realize de 5 a 6 refeições por dia (café da manhã,lanche da manhã, almoço, lanche da tarde, jantar e lanche da noite). Mastigar bem os alimentos."
                ],
                "glycemia": [
                    "Alimentação balanceada, utilizar carboidratos ricos em fibras e que forneçam energia lentamente como raízes e cereais integrais em pequenas quantidades."
                ],
                "blood_pressure": [
                    "Cortar o consumo excessivo de sal. O ideal é usar no máximo uma colher rasa de chá por pessoa/dia. Os pais sempre devem dar o exemplo."
                ]
            }
        }
    },
    {
        id: "5cb4881851b5f21bb364ba6f",
        created_at: "2018-11-20T14:40:00Z",
        status: EvaluationStatus.incomplete,
        patient_id: "5cb4882751b5f21ba364ba6f",
        nutritional_status: nutritionalStatus,
        overweight_indicator: overWeightIndicator,
        heart_rate: heartRateEvaluation,
        blood_glucose: bloodGlucoseEvaluation,
        blood_pressure: bloodPressureEvaluation,
        measurements: Measurements,
        physical_activity_habits: PhysicalActivityHabitsLocal,
        feeding_habits_record: FeedingHabitsRecordLocal,
        medical_record: MedicalRecordLocal,
        counselings: {
            "suggested": {
                "bmi_whr": [
                    "Realize de 5 a 6 refeições por dia (café da manhã,lanche da manhã, almoço, lanche da tarde, jantar e lanche da noite). Mastigar bem os alimentos.",
                    "Preparar pratos coloridos e diversificados para estimular o apetite.",
                    "Adicione uma colher de sopa de azeite de oliva extra virgem no almoço e no jantar."
                ],
                "glycemia": [
                    "Alimentação balanceada, utilizar carboidratos ricos em fibras e que forneçam energia lentamente como raízes e cereais integrais em pequenas quantidades.",
                    "Preferir água ao invés de refrigerantes, que não tem valor nutritivo e aumenta a concentração de açúcar no sangue.",
                    "Priorizar os vegetais (verduras e legumes) nas principais refeições."
                ],
                "blood_pressure": [
                    "Cortar o consumo excessivo de sal. O ideal é usar no máximo uma colher rasa de chá por pessoa/dia. Os pais sempre devem dar o exemplo.",
                    "A hidratação merece sempre atenção especial. Crianças e adolescentes devem consumir cerca de um litro e meio de água ao longo do dia."
                ]
            },
            "definitive": {
                "bmi_whr": {},
                "glycemia": {},
                "blood_pressure": {}
            }
        }
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
        } else {
            myParams = myParams.append("limit", String(Number.MAX_SAFE_INTEGER));
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
        } else {
            myParams = myParams.append("limit", String(Number.MAX_SAFE_INTEGER));
        }

        if (search) {
            myParams = myParams.append("?search", "*" + search + "*");
        }

        const url = `${environment.api_url}/patients/${patient_id}/nutritional/evaluations`;
        return Promise.resolve(mock);
        return this.http.get<any>(url, { params: myParams })
            .toPromise();
    }

    getAllByPilotstudy(pilostudy_id: string, page?: number, limit?: number, search?: string): Promise<NutritionEvaluation[]> {
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
        } else {
            myParams = myParams.append("limit", String(Number.MAX_SAFE_INTEGER));
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
        return this.http.get<any>(`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation_id}`)
            .toPromise();
    }

    finalize(evaluation_id: string, patient_id: string, counselings: NutritionalCouncil): Promise<NutritionEvaluation> {
        return this.http.post<any>
            (`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${evaluation_id}/counselings`, counselings)
            .toPromise();
    }

    remove(patient_id: string, nutritionevaluation_id: string): Promise<NutritionEvaluation> {
        return this.http.delete<any>
            (`${environment.api_url}/patients/${patient_id}/nutritional/evaluations/${nutritionevaluation_id}`)
            .toPromise();
    }

    sendNutritionalEvaluationViaEmail(email: string, nutritonalEvaluation: NutritionEvaluation): Promise<boolean> {
        const body = {
            email: email,
            evaluation: nutritonalEvaluation
        };
        return Promise.reject(false);
        // return this.http.post<any>
        //     (`${environment.api_url}/notification`, body)
        //     .toPromise();
    }

}
