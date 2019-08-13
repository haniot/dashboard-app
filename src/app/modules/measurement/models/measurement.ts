export enum EnumMeasurementType {
    weight = 'weight',
    blood_glucose = 'blood_glucose',
    body_fat = 'body_fat',
    // heart_rate = 'heart_rate',
    blood_pressure = 'blood_pressure',
    height = 'height',
    waist_circumference = 'waist_circumference',
    body_temperature = 'body_temperature'
}

export class GenericMeasurement {
    id: string;
    unit: string;
    type: EnumMeasurementType;
    patient_id: string;
    device_id?: string;

    constructor() {
        this.id = ''
        this.unit = '';
        this.patient_id = '';
        this.device_id = '';
    }
}

export class Measurement extends GenericMeasurement {
    value: number;
    timestamp: string;

    constructor() {
        super()
        this.value = 0;
        this.timestamp = '';
    }
}
