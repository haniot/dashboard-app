export enum MeasurementType {
    weight = "weight",
    blood_glucose = "blood_glucose",
    fat = "fat",
    heart_rate = "heart_rate",
    blood_pressure = "blood_pressure",
    height = "height",
    waist_circumference = "waist_circumference",
    body_temperature = "body_temperature"
}

export interface IMeasurement {
    id: string;
    unit: string;
    type: MeasurementType;
    user_id: string;
    device_id?: string;
}

export class Measurement implements IMeasurement {
    id: string;
    value: number;
    unit: string;
    type: MeasurementType;
    timestamp: string;
    user_id: string;
    device_id?: string;

    constructor() {
    }
}
