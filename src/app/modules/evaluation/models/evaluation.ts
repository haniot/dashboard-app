export enum EvaluationStatus {
    complete = "complete",
    incomplete = "incomplete"
}

export interface ICounseling {
    suggested: any;
    definitive: any
}

export interface IEvaluation {
    id: string;
    created_at: string;
    status: EvaluationStatus;
    patient_id: string;
    counselings: ICounseling;
}

export class Evaluation implements IEvaluation {

    id: string;
    created_at: string;
    status: EvaluationStatus;
    patient_id: string;
    counselings: ICounseling;

    constructor() { }
}
