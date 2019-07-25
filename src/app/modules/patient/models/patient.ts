import {IUser, User} from "../../../shared/shared.models/user";

export interface IPatient extends IUser {
    name: string;
    gender: Gender;
    password?: string;
    password_confirm?: string;
}

export enum Gender {
    male = 'male',
    female = 'female'
}

export class Patient extends User implements IPatient {

    name: string;
    gender: Gender;
    password?: string;
    password_confirm?: string;

    constructor() {
        super();
        this.name = "";
        this.password = "";
        this.password_confirm = "";
    }

}


