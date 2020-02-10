export enum EnumMeasurementType {
    weight = 'weight',
    blood_glucose = 'blood_glucose',
    body_fat = 'body_fat',
    blood_pressure = 'blood_pressure',
    height = 'height',
    waist_circumference = 'waist_circumference',
    body_temperature = 'body_temperature'
}

export class GenericMeasurement {
    private _id: string;
    private _unit: string;
    private _type: EnumMeasurementType;
    private _patient_id: string;
    private _device_id?: string;

    get id(): string {
        return this._id
    }

    set id(value: string) {
        this._id = value
    }

    get unit(): string {
        return this._unit
    }

    set unit(value: string) {
        this._unit = value
    }

    get type(): EnumMeasurementType {
        return this._type
    }

    set type(value: EnumMeasurementType) {
        this._type = value
    }

    get patient_id(): string {
        return this._patient_id
    }

    set patient_id(value: string) {
        this._patient_id = value
    }

    get device_id(): string {
        return this._device_id
    }

    set device_id(value: string) {
        this._device_id = value
    }
}

// export class Measurement extends GenericMeasurement {
//     value: number;
//     timestamp: string;
//
//     constructor() {
//         super()
//         this.value = 0;
//         this.timestamp = '';
//     }
// }

export class Measurement {
    /* required */
    private _value: number;
    private _unit: string;
    private _timestamp: string;
    private _type: EnumMeasurementType;
    /* readonly */
    private readonly _id: string
    private readonly _patient_id: string
    /* optional */
    private _device_id?: string;

    get id(): string {
        return this._id
    }

    get patient_id(): string {
        return this._patient_id
    }

    get value(): number {
        return this._value
    }

    set value(value: number) {
        this._value = value
    }

    get unit(): string {
        return this._unit
    }

    set unit(value: string) {
        this._unit = value
    }

    get timestamp(): string {
        return this._timestamp
    }

    set timestamp(value: string) {
        this._timestamp = value
    }

    get type(): EnumMeasurementType {
        return this._type
    }

    set type(value: EnumMeasurementType) {
        this._type = value
    }

    get device_id(): string {
        return this._device_id
    }

    set device_id(value: string) {
        this._device_id = value
    }
}
