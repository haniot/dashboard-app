import { Measurement } from './measurement';


export class Weight extends Measurement {
    body_fat: number;

    constructor() {
        super();
        this.body_fat = 0;
    }
}
