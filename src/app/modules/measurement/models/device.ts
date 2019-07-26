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
    id: string;
    name: string;
    address: string;
    type: DeviceType;
    model_number: number;
    manufacturer: string;

    constructor() {
        this.id = '';
        this.name = '';
        this.address = '';
        this.model_number = 0;
        this.manufacturer = '';
    }
}
