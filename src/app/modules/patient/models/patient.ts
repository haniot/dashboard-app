import { User } from '../../../shared/shared.models/user';

export enum Gender {
    male = 'male',
    female = 'female'
}

export class Patient extends User {

    name: string;
    gender: Gender;
    password?: string;
    password_confirm?: string;

    constructor() {
        super();
        this.name = '';
        this.password = '';
        this.password_confirm = '';
    }

}


