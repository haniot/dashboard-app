export interface IUser {
    id: string;
    email: string;
    name?: string;
    health_area?: HealtArea;
}

export class Admin implements IUser {
    id: string;
    email: string;
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

    constructor() { }
}

