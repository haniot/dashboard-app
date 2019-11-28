import { GenericMeasurement } from './measurement';

export class DataSetUnit {
    private _value: number;
    private _timestamp: string;

    constructor() {
        this._value = 0;
        this._timestamp = '';
    }


    get value(): number {
        return this._value
    }

    set value(value: number) {
        this._value = value
    }

    get timestamp(): string {
        return this._timestamp
    }

    set timestamp(value: string) {
        this._timestamp = value
    }
}

export class HeartRate extends GenericMeasurement {
    dataset: Array<any>;

    constructor() {
        super();
        this.dataset = new Array<DataSetUnit>();
    }
}
