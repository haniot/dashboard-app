export interface IPatient {

    id: string;
    pilotstudy_id: string;
    first_name: string;
    last_name: string;
    gender: string;
    birth_date: string;

}

export enum Gender{
    male = 'male',
    female = 'female'
}

export class Patient implements IPatient {

    id: string;
    pilotstudy_id: string;
    first_name: string;
    last_name: string;
    gender: string;
    birth_date: string;

    constructor(){}

}


