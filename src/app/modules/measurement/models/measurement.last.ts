import { BloodGlucose } from './blood.glucose'
import { BloodPressure } from './blood.pressure'
import { Weight } from './weight'
import { Measurement } from './measurement'

export class MeasurementLast {
    private _blood_glucose: BloodGlucose;
    private _blood_pressure: BloodPressure;
    private _body_fat: Measurement;
    private _body_temperature: Measurement;
    private _height: Measurement;
    private _waist_circumference: Measurement;
    private _weight: Weight

    constructor() {
        this._blood_glucose = new BloodGlucose();
        this._blood_pressure = new BloodPressure();
        this._body_fat = new Measurement();
        this._body_temperature = new Measurement();
        this._height = new Measurement();
        this._waist_circumference = new Measurement();
        this._weight = new Weight();
    }


    get blood_glucose(): BloodGlucose {
        return this._blood_glucose
    }

    set blood_glucose(value: BloodGlucose) {
        this._blood_glucose = value
    }

    get blood_pressure(): BloodPressure {
        return this._blood_pressure
    }

    set blood_pressure(value: BloodPressure) {
        this._blood_pressure = value
    }

    get body_fat(): Measurement {
        return this._body_fat
    }

    set body_fat(value: Measurement) {
        this._body_fat = value
    }

    get body_temperature(): Measurement {
        return this._body_temperature
    }

    set body_temperature(value: Measurement) {
        this._body_temperature = value
    }

    get height(): Measurement {
        return this._height
    }

    set height(value: Measurement) {
        this._height = value
    }

    get waist_circumference(): Measurement {
        return this._waist_circumference
    }

    set waist_circumference(value: Measurement) {
        this._waist_circumference = value
    }

    get weight(): Weight {
        return this._weight
    }

    set weight(value: Weight) {
        this._weight = value
    }
}
