import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'environments/environment';
import { IMeasurement, Measurement, MeasurementType } from '../models/measurement';
import { BloodGlucose, MealType } from '../models/blood-glucose';
import { BloodPressure } from '../models/blood-pressure';
import { HeartRate } from '../models/heart-rate';

const mock: Array<IMeasurement | BloodGlucose | BloodPressure | HeartRate> = [
  {
    "id": "5cb4882751b5f21ba364ba6f",
    "value": 50,
    "unit": "kg",
    "type": MeasurementType.weight,
    "timestamp": "2018-11-19T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4882751b5f21ba364ba6f",
    "value": 51,
    "unit": "kg",
    "type": MeasurementType.weight,
    "timestamp": "2018-11-20T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4882751b5f21ba364ba6f",
    "value": 55,
    "unit": "kg",
    "type": MeasurementType.weight,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4882751b5f21ba364ba6f",
    "value": 58,
    "unit": "kg",
    "type": MeasurementType.weight,
    "timestamp": "2018-11-22T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4882751b5f21ba364ba6f",
    "value": 59,
    "unit": "kg",
    "type": MeasurementType.weight,
    "timestamp": "2018-11-23T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4882751b5f21ba364ba6f",
    "value": 61,
    "unit": "kg",
    "type": MeasurementType.weight,
    "timestamp": "2018-11-24T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488277b26234cfe2635da",
    "dataset": [
      {
        "value": 90,
        "timestamp": "2018-11-19T14:40:00Z"
      },
      {
        "value": 87,
        "timestamp": "2018-11-19T14:41:00Z"
      },
      {
        "value": 89,
        "timestamp": "2018-11-19T14:42:00Z"
      },
      {
        "value": 90,
        "timestamp": "2018-11-19T14:43:00Z"
      },
      {
        "value": 91,
        "timestamp": "2018-11-19T14:44:00Z"
      }
    ],
    "unit": "bpm",
    "type": MeasurementType.heart_rate,
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb48827217ee2910ea11e84",
    "systolic": 120,
    "diastolic": 80,
    "unit": "mmHg",
    "type": MeasurementType.blood_pressure,
    "timestamp": "2018-11-19T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 150,
    "unit": "cm",
    "type": MeasurementType.height,
    "timestamp": "2018-11-19T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 152,
    "unit": "cm",
    "type": MeasurementType.height,
    "timestamp": "2018-11-20T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 153,
    "unit": "cm",
    "type": MeasurementType.height,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 158,
    "unit": "cm",
    "type": MeasurementType.height,
    "timestamp": "2018-11-23T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 160,
    "unit": "cm",
    "type": MeasurementType.height,
    "timestamp": "2018-11-25T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 152,
    "unit": "cm",
    "type": MeasurementType.height,
    "timestamp": "2018-11-20T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 153,
    "unit": "cm",
    "type": MeasurementType.height,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 158,
    "unit": "cm",
    "type": MeasurementType.height,
    "timestamp": "2018-11-23T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 160,
    "unit": "cm",
    "type": MeasurementType.height,
    "timestamp": "2018-11-25T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 70,
    "unit": "cm",
    "type": MeasurementType.waist_circunference,
    "timestamp": "2018-11-19T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 100,
    "unit": "cm",
    "type": MeasurementType.waist_circunference,
    "timestamp": "2018-11-20T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 115,
    "unit": "cm",
    "type": MeasurementType.waist_circunference,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 150,
    "unit": "cm",
    "type": MeasurementType.waist_circunference,
    "timestamp": "2018-11-22T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 100,
    "unit": "cm",
    "type": MeasurementType.waist_circunference,
    "timestamp": "2018-11-23T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488279ea138bd6abf936a",
    "value": 170,
    "unit": "cm",
    "type": MeasurementType.waist_circunference,
    "timestamp": "2018-11-24T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4b2fd02eb7733b03db810",
    "value": 36,
    "unit": "°C",
    "type": MeasurementType.body_temperature,
    "timestamp": "2018-11-19T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4b2fd02eb7733b03db810",
    "value": 35,
    "unit": "°C",
    "type": MeasurementType.body_temperature,
    "timestamp": "2018-11-20T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4b2fd02eb7733b03db810",
    "value": 36,
    "unit": "°C",
    "type": MeasurementType.body_temperature,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4b2fd02eb7733b03db810",
    "value": 36,
    "unit": "°C",
    "type": MeasurementType.body_temperature,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4b2fd02eb7733b03db810",
    "value": 37,
    "unit": "°C",
    "type": MeasurementType.body_temperature,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb4b2fd02eb7733b03db810",
    "value": 39,
    "unit": "°C",
    "type": MeasurementType.body_temperature,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 99,
    "unit": "mg/dl",
    "meal": MealType.preprandial,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-19T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 100,
    "unit": "mg/dl",
    "meal": MealType.preprandial,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-20T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 125,
    "unit": "mg/dl",
    "meal": MealType.preprandial,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 80,
    "unit": "mg/dl",
    "meal": MealType.postprandial,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-19T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 90,
    "unit": "mg/dl",
    "meal": MealType.postprandial,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-20T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 75,
    "unit": "mg/dl",
    "meal": MealType.postprandial,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 45,
    "unit": "mg/dl",
    "meal": MealType.fasting,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-19T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 49,
    "unit": "mg/dl",
    "meal": MealType.fasting,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-20T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 50,
    "unit": "mg/dl",
    "meal": MealType.fasting,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 90,
    "unit": "mg/dl",
    "meal": MealType.casual,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-19T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 90,
    "unit": "mg/dl",
    "meal": MealType.casual,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-20T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 99,
    "unit": "mg/dl",
    "meal": MealType.casual,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 100,
    "unit": "mg/dl",
    "meal": MealType.bedtime,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-19T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 115,
    "unit": "mg/dl",
    "meal": MealType.bedtime,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-20T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
  {
    "id": "5cb488278cf5f9e6760c14ed",
    "value": 150,
    "unit": "mg/dl",
    "meal": MealType.bedtime,
    "type": MeasurementType.blood_glucose,
    "timestamp": "2018-11-21T14:40:00Z",
    "user_id": "5a62be07d6f33400146c9b61",
    "device_id": "5ca790f77aefffa37a17b605"
  },
];
@Injectable()
export class MeasurementService {

  constructor(private http: HttpClient) { }

  getAll(page?: number, limit?: number): Promise<IMeasurement[]> {
    let myParams = new HttpParams();

    if (page && limit) {
      myParams = new HttpParams()
        .set("page", String(page))
        .set("limit", String(limit))
        .set("sort", 'created_a');
    }

    const url = `${environment.api_url}/measurements`;

    return this.http.get<any>(url, { params: myParams })
      .toPromise();
  }

  getAllByUser(userId: string): Promise<Array<IMeasurement> | Array<any>> {
    return Promise.resolve(mock);
    // return this.http.get<any>(`${environment.api_url}/users/${userId}/measurements`)
    //   .toPromise();
  }

  create(userId: string, measurement: Measurement): Promise<IMeasurement> {
    return this.http.post<any>(`${environment.api_url}/users/${userId}/measurements`, measurement)
      .toPromise();
  }

  getById(userId: string, measurementId: string): Promise<IMeasurement> {
    return this.http.get<any>(`${environment.api_url}/users/${userId}/measurements/${measurementId}`)
      .toPromise();
  }

  remove(userId: string, measurementId: string): Promise<IMeasurement> {
    return this.http.delete<any>(`${environment.api_url}/users/${userId}/measurements/${measurementId}`)
      .toPromise();
  }

}
