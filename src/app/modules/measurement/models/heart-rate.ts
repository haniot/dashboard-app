import { MeasurementType } from './measurement';
class DataSet {
    value: number;
    timestamp: string;
}
export class HeartRate {
    id: string;
    dataset: Array<DataSet>;
    unit: string;
    type: MeasurementType;
    user_id: string;
    device_id?: string;
}