export enum EvaluationStatus {
    complete = 'complete',
    incomplete = 'incomplete'
}

export class Counseling {
    suggested: any;
    definitive: any
}

export class Evaluation {

    id: string;
    created_at: string;

    constructor() {
    }
}
