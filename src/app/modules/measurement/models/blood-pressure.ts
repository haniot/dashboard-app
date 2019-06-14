import {IMeasurement, MeasurementType} from './measurement';

export class BloodPressure implements IMeasurement {
    id: string;
    systolic: number;
    diastolic: number;
    pulse: number
    unit: string;
    type: MeasurementType;
    timestamp: string;
    user_id: string;
    device_id?: string;
}
