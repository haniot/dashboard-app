import { GenericUser } from '../../../shared/shared.models/generic.user';

export enum Gender {
    male = 'male',
    female = 'female',
    undefined = 'undefined'
}


export class PatientBasic {
    id: string;
    name: string;
    email: string;
    birth_date: string;
    gender: Gender;

    constructor() {
        this.id = '';
        this.name = '';
        this.birth_date = '';
        this.gender = Gender.undefined
    }

}

export class Patient extends GenericUser {

    name: string;
    gender: Gender;
    password?: string;
    password_confirm?: string;

    constructor() {
        super();
        this.name = '';
        this.gender = Gender.undefined;
        this.password = '';
        this.password_confirm = '';
    }

}


