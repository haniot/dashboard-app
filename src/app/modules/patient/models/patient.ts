import { GenericUser } from '../../../shared/shared.models/generic.user';
import { ExternalService } from './external.service'

export enum Gender {
    male = 'male',
    female = 'female'
}

export class PatientBasic {
    private _id: string;
    private _name: string;
    private _email: string;
    private _birth_date: string;
    private _gender: Gender;

    constructor() {
        this._id = '';
        this._name = '';
        this._birth_date = '';
    }


    get id(): string {
        return this._id
    }

    set id(value: string) {
        this._id = value
    }

    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value
    }

    get email(): string {
        return this._email
    }

    set email(value: string) {
        this._email = value
    }

    get birth_date(): string {
        return this._birth_date
    }

    set birth_date(value: string) {
        this._birth_date = value
    }

    get gender(): Gender {
        return this._gender
    }

    set gender(value: Gender) {
        this._gender = value
    }
}

export class Patient extends GenericUser {
    /* required */
    private _gender: Gender;
    /* optional */
    private _password?: string;
    private _password_confirm?: string;
    private _address?: string
    /* readonly */
    private readonly _external_services: ExternalService


    get gender(): Gender {
        return this._gender
    }

    set gender(value: Gender) {
        this._gender = value
    }

    get password(): string {
        return this._password
    }

    set password(value: string) {
        this._password = value
    }

    get password_confirm(): string {
        return this._password_confirm
    }

    set password_confirm(value: string) {
        this._password_confirm = value
    }

    get address(): string {
        return this._address
    }

    set address(value: string) {
        this._address = value
    }

    get external_services(): ExternalService {
        return this._external_services
    }
}


