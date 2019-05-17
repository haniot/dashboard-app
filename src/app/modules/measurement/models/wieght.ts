import { Measurement, } from './measurement';


class Fat {
    value: number;
    unit: string;
}


export class Weight extends Measurement {
    fat: Fat;
}