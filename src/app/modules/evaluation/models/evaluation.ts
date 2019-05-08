export enum EvaluationStatus {
    complete = "complete",
    incomplete = "incomplete"
}
export interface IEvaluation {
    id: string;
    created_at: string;
    status: EvaluationStatus;
    patient_id: string;
}
export class Evaluation implements IEvaluation {

    id: string;
    created_at: string;
    status: EvaluationStatus;
    patient_id: string;

    constructor() { }
}
