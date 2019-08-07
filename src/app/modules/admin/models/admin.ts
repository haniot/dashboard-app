import { GenericUser } from '../../../shared/shared.models/generic.user';

export class Admin extends GenericUser {
    total_pilot_studies: number;
    total_admins: number;
    total_health_professionals: number;
    total_patients: number;

    constructor() {
        super();
        this.total_pilot_studies = 0;
        this.total_admins = 0;
        this.total_health_professionals = 0;
        this.total_patients = 0;
    }
}
