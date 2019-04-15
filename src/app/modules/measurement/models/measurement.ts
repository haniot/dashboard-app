export enum MeasurementType {
    weight = "weight",
    blood_glucose = "blood_glucose",
    heartrate = "heartrate",
    blood_pressure = "blood_pressure",
    anthropometric = "anthropometric",
    body_temperature = "body_temperature"
}

export interface IMeasurement {
    id: string;
    unit?: string;
    type: MeasurementType;
    timestamp?: string;
    user_id: string;
    device_id: string;
}


export class Measurement implements IMeasurement {
    id: string;
    unit?: string;
    type: MeasurementType;
    timestamp?: string;
    user_id: string;
    device_id: string;

    constructor() { }
}