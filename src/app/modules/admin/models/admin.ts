import { GenericUser } from '../../../shared/shared.models/generic.user';

export class Admin extends GenericUser {
    /* required */
    private _password: string;
    /* readonly */
    private readonly _total_pilot_studies: number;
    private readonly _total_admins: number;
    private readonly _total_health_professionals: number;
    private readonly _total_patients: number;

    get password(): string {
        return this._password
    }

    set password(value: string) {
        this._password = value
    }

    get total_pilot_studies(): number {
        return this._total_pilot_studies
    }

    get total_admins(): number {
        return this._total_admins
    }

    get total_health_professionals(): number {
        return this._total_health_professionals
    }

    get total_patients(): number {
        return this._total_patients
    }
}
