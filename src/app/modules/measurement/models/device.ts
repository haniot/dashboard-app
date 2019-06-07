export enum DeviceType {
    thermometer = "thermometer",
    glucometer = "glucometer",
    body_composition = "body_composition",
    blood_pressure = "blood_pressure",
    heart_rate = "heart_rate",
    smartwatch = "smartwatch",
    smartband = "smartband"
}

export interface IDevice {
    id: string;
    name: string;
    address: string;
    type: DeviceType;
    model_number: number;
    manufacturer: string;
}

export class Device implements IDevice {
    id: string;
    name: string;
    address: string;
    type: DeviceType;
    model_number: number;
    manufacturer: string;
}