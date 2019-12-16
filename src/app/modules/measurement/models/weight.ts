import { Measurement } from './measurement';


export class Weight extends Measurement {
    /* optional */
    private _body_fat?: number;

    get body_fat(): number {
        return this._body_fat
    }

    set body_fat(value: number) {
        this._body_fat = value
    }
}
