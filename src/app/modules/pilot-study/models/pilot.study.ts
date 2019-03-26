export interface IPilotStudy {

    id: string;
    name: string;
    is_active: boolean;
    start: string;
    end: string;
    health_professionals_id: Array<string>;

}

export class PilotStudy implements IPilotStudy {

    id: string;
    name: string;
    is_active: boolean;
    start: string;
    end: string;
    health_professionals_id: Array<string>;

    constructor(){}

}


