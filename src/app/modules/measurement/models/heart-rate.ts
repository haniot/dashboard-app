import {IMeasurement, MeasurementType} from './measurement';

export class DataSetUnit {
    value: number;
    timestamp: string;
}

export class HeartRate implements IMeasurement {
    id: string;
    dataset: Array<DataSetUnit>;
    unit: string;
    type: MeasurementType;
    user_id: string;
    device_id?: string;
}
