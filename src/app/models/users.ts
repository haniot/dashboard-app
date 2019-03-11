export interface IUser{
    id: string,
    name: string;
    email: string;
    password?: string;
    type: number;
    created_at: Date
}
export class User implements IUser{

    id: string;
    name: string;
    email: string;
    password: string;
    type: number;
    created_at: Date;

    constructor() {

    }

}
