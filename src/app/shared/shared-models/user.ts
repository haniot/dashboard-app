export interface IUser {
    id: string;
    email: string;
    birth_date: string;
    phone_number: string;
    last_login: number;
    last_sync: number;
    selected_pilot_study: string;
    language: string;
}

export class User implements IUser {
    id: string;
    email: string;
    birth_date: string;
    phone_number: string;
    last_login: number;
    last_sync: number;
    selected_pilot_study: string;
    language: string;

    constructor() {
        this.id = "";
        this.email = "";
        this.birth_date = "";
        this.phone_number = "";
        this.last_login = 0;
        this.last_sync = 0;
        this.selected_pilot_study = "";
        this.language = "";
    }

}
