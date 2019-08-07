export class PilotStudy {

    id: string;
    name: string;
    is_active: boolean;
    start: string;
    end: string;
    total_health_professionals: number;
    total_patients: number;
    location?: string;

    constructor() {
        this.id = '';
        this.name = '';
        this.is_active = true;
        this.start = '';
        this.end = '';
        this.total_health_professionals = 0
        this.total_patients = 0
        this.location = ''
    }

}


