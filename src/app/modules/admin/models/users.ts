import {User} from "../../../shared/shared-models/user";

export class Admin extends User {
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

export enum HealtArea {
    nutrition = 'nutrition',
    dentistry = 'dentistry'
}

export class HealthProfessional extends User {
    name: string;
    health_area: HealtArea;
    total_pilot_studies: number;
    total_patients: number;

    constructor() {
        super();
        this.name = "";
        this.total_pilot_studies = 0;
        this.total_patients = 0;
    }
}
