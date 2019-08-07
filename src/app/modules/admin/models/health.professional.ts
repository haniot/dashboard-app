import { GenericUser } from '../../../shared/shared.models/generic.user';

export class Admin extends GenericUser {
    private total_pilot_studies: number;
    private total_admins: number;
    private total_health_professionals: number;
    private total_patients: number;

    constructor() {
        super();
        this.total_pilot_studies = 0;
        this.total_admins = 0;
        this.total_health_professionals = 0;
        this.total_patients = 0;
    }

}

export enum HealtArea {
    nutrition = 'nutrition',
    dentistry = 'dentistry'
}

export class HealthProfessional extends GenericUser {
    name: string;
    health_area: HealtArea;
    total_pilot_studies: number;
    total_patients: number;

    constructor() {
        super();
        this.name = '';
        this.total_pilot_studies = 0;
        this.total_patients = 0;
    }

}
