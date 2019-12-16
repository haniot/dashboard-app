import { Measurement } from './measurement';

export class BloodPressure extends Measurement {
    /* required */
    private _systolic: number;
    private _diastolic: number;
    private _pulse: number

    get systolic(): number {
        return this._systolic
    }

    set systolic(value: number) {
        this._systolic = value
    }

    get diastolic(): number {
        return this._diastolic
    }

    set diastolic(value: number) {
        this._diastolic = value
    }

    get pulse(): number {
        return this._pulse
    }

    set pulse(value: number) {
        this._pulse = value
    }
}
