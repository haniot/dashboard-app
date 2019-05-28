import { Measurement } from './measurement';

export enum MealType {
    preprandial = "preprandial",
    postprandial = "postprandial",
    fasting = "fasting",
    casual = "casual",
    bedtime = "bedtime"
}
export class BloodGlucose extends Measurement {
    meal: MealType;
}