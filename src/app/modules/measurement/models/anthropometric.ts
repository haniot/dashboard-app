import { Measurement } from './measurement';

export class Anthropometric extends Measurement {
    height_value: number;
    height_unit: string;
    waist_circ_value: number;
    waist_circ_unit: string;
}