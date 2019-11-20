export class GenericUser {
    id: string;
    created_at: string;
    name: string;
    email: string;
    birth_date: string;
    phone_number: string;
    last_login: string;
    last_sync: string;
    selected_pilot_study: string;
    total_pilot_studies: number;
    language: string;

    constructor() {
        this.id = '';
        this.created_at = '';
        this.name = '';
        this.email = '';
        this.birth_date = '';
        this.phone_number = '';
        this.last_login = '';
        this.last_sync = '';
        this.selected_pilot_study = '';
        this.total_pilot_studies = 0;
        this.language = '';
    }
}
