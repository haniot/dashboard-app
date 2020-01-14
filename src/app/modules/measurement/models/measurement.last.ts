import { BloodGlucose } from './blood.glucose'
import { BloodPressure } from './blood.pressure'
import { Weight } from './weight'
import { Measurement } from './measurement'

export class MeasurementLast {
    blood_glucose: BloodGlucose;
    blood_pressure: BloodPressure;
    body_fat: Measurement;
    body_temperature: Measurement;
    height: Measurement;
    waist_circumference: Measurement;
    weight: Weight

    constructor() {
        this.blood_glucose = new BloodGlucose();
        this.blood_pressure = new BloodPressure();
        this.body_fat = new Measurement();
        this.body_temperature = new Measurement();
        this.height = new Measurement();
        this.waist_circumference = new Measurement();
        this.weight = new Weight();
    }
}
