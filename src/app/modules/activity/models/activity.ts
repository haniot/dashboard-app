export abstract class Activity {
    /* required */
    private _start_time: string;
    private _end_time: string;
    private _duration: number;
    /* readonly */
    private readonly _id: string
    private readonly _patient_id: string

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
