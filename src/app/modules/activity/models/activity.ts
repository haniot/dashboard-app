export abstract class Activity {
    /* required */
    private _start_time: string;
    private _end_time: string;
    private _duration: number;
    /* readonly */
    private readonly _id: string
    private readonly _patient_id: string

    constructor() {
        this._start_time = '2019-12-19T19:51:45.888Z';
        this._end_time = '2019-12-19T20:51:45.888Z';
        this._duration = 5602000;
    }

    get id(): string {
        return this._id
    }

    get patient_id(): string {
        return this._patient_id
    }

    get start_time(): string {
        return this._start_time
    }

    set start_time(value: string) {
        this._start_time = value
    }

    get end_time(): string {
        return this._end_time
    }

    set end_time(value: string) {
        this._end_time = value
    }

    get duration(): number {
        return this._duration
    }

    set duration(value: number) {
        this._duration = value
    }
}

export enum Levels {
    SEDENTARY = 'sedentary',
    LIGHT = 'light',
    FAIRLY = 'fairly',
    VERY = 'very'
}

export class ActivityLevel {
    /* requied */
    private _name: Levels;
    private _duration: number;

    constructor(name: Levels, duration: number) {
        this._name = name;
        this._duration = duration;
    }

    get name(): Levels {
        return this._name
    }

    set name(value: Levels) {
        this._name = value
    }

    get duration(): number {
        return this._duration
    }

    set duration(value: number) {
        this._duration = value
    }
}
