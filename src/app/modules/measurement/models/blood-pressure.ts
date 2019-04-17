import { MeasurementType } from './measurement';

export class BloodPressure {
    id: string;
    systolic: number;
    diastolic: number;
    unit: string;
    type: MeasurementType;
    timestamp: string;
    user_id: string;
    device_id?: string;
}