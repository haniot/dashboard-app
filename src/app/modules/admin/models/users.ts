export class Admin {
    id: string;
    email: string;
    language: string;
}

export interface IUser {
    id: string;
    email: string;
    name?: string;
    health_area?: HealtArea;
    language: string;
}

export enum HealtArea {
    nutrition = 'nutrition',
    dentistry = 'dentistry'

}

export class HealthProfessional implements IUser {

    id: string;
    name: string;
    email: string;
    health_area: HealtArea;
    language: string;

    constructor() {
    }
}


