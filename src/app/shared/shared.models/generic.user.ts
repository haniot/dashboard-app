export enum UserType {
    ADMIN = 'admin',
    HEALTH_PROFESSIONAL = 'health_professional',
    PATIENT = 'patient'
}

export enum LanguageType {
    PT_BR = 'pt-BR',
    EN_US = 'en-US'
}

export class GenericUser {
    /* required */
    private _birth_date: string;
    private _name: string;
    /* optional */
    private _phone_number?: string;
    private _language?: LanguageType;
    private _selected_pilot_study?: string;
    /* readonly */
    private readonly _id: string;
    private readonly _created_at: string;
    private readonly _last_login: string;

    constructor(id: string) {
        this._id = id
    }

    get id(): string {
        return this._id
    }

    get created_at(): string {
        return this._created_at
    }

    get last_login(): string {
        return this._last_login
    }

    get birth_date(): string {
        return this._birth_date
    }

    set birth_date(value: string) {
        this._birth_date = value
    }

    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value
    }

    get phone_number(): string {
        return this._phone_number
    }

    set phone_number(value: string) {
        this._phone_number = value
    }

    get language(): LanguageType {
        return this._language
    }

    set language(value: LanguageType) {
        this._language = value
    }

    get selected_pilot_study(): string {
        return this._selected_pilot_study
    }

    set selected_pilot_study(value: string) {
        this._selected_pilot_study = value
    }
}
