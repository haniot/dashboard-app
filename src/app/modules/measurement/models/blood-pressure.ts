import { GenericMeasurement } from './measurement';

export class BloodPressure extends GenericMeasurement {
    systolic: number;
    diastolic: number;
    pulse: number
    timestamp: string;

    constructor() {
        super();
        this.systolic = 0;
        this.diastolic = 0;
        this.pulse = 0;
        this.timestamp = '';
    }


}
