import { GenericUser } from '../../../shared/shared.models/generic.user';

export enum HealtAreaType {
    nutrition = 'nutrition',
    dentistry = 'dentistry',
    nursing = 'nursing',
    endocrinology = 'endocrinology',
    other = 'other'
}

export class HealthProfessional extends GenericUser {
    /* required */
    private _password: string;
    private _health_area: HealtAreaType;
    /* readonly */
    private readonly _total_patients: number;
    private readonly _total_pilot_studies: number;

    get password(): string {
        return this._password
    }

    set password(value: string) {
        this._password = value
    }

    get health_area(): HealtAreaType {
        return this._health_area
    }

    set health_area(value: HealtAreaType) {
        this._health_area = value
    }


    get total_patients(): number {
        return this._total_patients
    }

    get total_pilot_studies(): number {
        return this._total_pilot_studies
    }
}
