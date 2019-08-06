import { Measurement } from './measurement';


export class Fat {
    value: number;
    unit: string;

    constructor() {
        this.value = 0;
        this.unit = '';
    }
}


export class Weight extends Measurement {
    fat: Fat;

    constructor() {
        super();
        this.fat = new Fat();
    }
}
