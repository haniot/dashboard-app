export interface IUser {

    id: string;
    username: string;
    email: string;
    name?: string;
    //health_area?: HealtArea;
    health_area?: string;

}

export class Admin implements IUser {

    id: string;
    username: string;
    email: string;

}

export enum HealtArea {
    nutrition = 'nutrition',
    dentistry = 'dentistry'

}

export class HealthProfessional implements IUser {
    id: string;
    username: string;
    email: string;
    name: string;
    //health_area: HealtArea;
    health_area: string;

}

