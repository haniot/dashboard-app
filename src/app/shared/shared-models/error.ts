export interface IError {
    code: number;
    message: string;
    description?: string;
    redirect_link?:string;
}

export class Error implements IError{
    code: number;
    message: string;
    description?: string;
    redirect_link?:string;

    constructor(){}
}