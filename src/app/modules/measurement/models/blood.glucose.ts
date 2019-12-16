import { Measurement } from './measurement';

export enum MealType {
    PREPRANDIAL = 'preprandial',
    POSTPRANDIAL = 'postprandial',
    FASTING = 'fasting',
    CASUAL = 'casual',
    BEDTIME = 'bedtime',
    OTHER = 'other'
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
