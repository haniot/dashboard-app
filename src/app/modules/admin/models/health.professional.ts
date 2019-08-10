import { GenericUser } from '../../../shared/shared.models/generic.user';

export enum HealtArea {
    nutrition = 'nutrition',
    dentistry = 'dentistry'
}

export class HealthProfessional extends GenericUser {
    name: string;
    health_area: HealtArea;
    total_patients: number;

    constructor() {
        super();
        this.name = '';
        this.total_patients = 0;
    }

}
