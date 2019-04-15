import { Measurement } from './measurement';

class DataSet {
    value: number;
    timestamp: string;
}

export class HeartRate extends Measurement {
    dataset: Array<DataSet>;
}