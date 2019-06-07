import { Measurement, } from './measurement';


export class Fat {
    value: number;
    unit: string;
}


export class Weight extends Measurement {
    fat: Fat;
}