import { Measurement } from './measurement';

export enum MealType {
    preprandial = 'preprandial',
    postprandial = 'postprandial',
    fasting = 'fasting',
    casual = 'casual',
    bedtime = 'bedtime',
    other = 'other'
}

export class BloodGlucose extends Measurement {
    /* required */
    private _meal: MealType;

    get meal(): MealType {
        return this._meal
    }

    set meal(value: MealType) {
        this._meal = value
    }
}
