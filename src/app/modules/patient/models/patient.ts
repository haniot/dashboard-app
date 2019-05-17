export interface IPatient {

    id: string;
    pilotstudy_id: string;
    name: string;
    email: string;
    gender: string;
    birth_date: string;
    password?: string;
    password_confirm?: string;
}

export enum Gender {
    male = 'male',
    female = 'female'
}

export class Patient implements IPatient {

    id: string;
    pilotstudy_id: string;
    name: string;
    email: string;
    gender: string;
    birth_date: string;
    password?: string;
    password_confirm?: string;

    constructor() { }

}


