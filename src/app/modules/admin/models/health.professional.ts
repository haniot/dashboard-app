import { GenericUser } from '../../../shared/shared.models/generic.user';

export enum HealtArea {
    nutrition = 'nutrition',
    dentistry = 'dentistry'
}

export class HealthProfessional extends GenericUser {
    health_area: HealtArea;
    total_patients: number;

    constructor() {
        super();
        this.total_patients = 0;
    }

}
