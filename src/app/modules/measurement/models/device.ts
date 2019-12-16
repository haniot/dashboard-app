export enum DeviceType {
    thermometer = 'thermometer',
    glucometer = 'glucometer',
    body_composition = 'body_composition',
    blood_pressure = 'blood_pressure',
    heart_rate = 'heart_rate',
    smartwatch = 'smartwatch',
    smartband = 'smartband'
}

export class Device {
    /* readonly */
    private readonly _id: string;
    /* required */
    private _name: string;
    private _address: string;
    private _type: DeviceType;
    private _manufacturer: string;
    /* optional */
    private _model_number: number;

    get id(): string {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get address(): string {
        return this._address
    }

    get type(): DeviceType {
        return this._type
    }

    get manufacturer(): string {
        return this._manufacturer
    }

    get model_number(): number {
        return this._model_number
    }

    set name(value: string) {
        this._name = value
    }

    set address(value: string) {
        this._address = value
    }

    set type(value: DeviceType) {
        this._type = value
    }

    set manufacturer(value: string) {
        this._manufacturer = value
    }

    set model_number(value: number) {
        this._model_number = value
    }
}
