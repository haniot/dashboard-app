import { GenericMeasurement } from './measurement';

export class DataSetUnit {
    value: number;
    timestamp: string;

    constructor() {
        this.value = 0;
        this.timestamp = '';
    }
}

export class HeartRate extends GenericMeasurement {
    dataset: Array<DataSetUnit>;

    constructor() {
        super();
        this.dataset = new Array<DataSetUnit>();
    }
}
