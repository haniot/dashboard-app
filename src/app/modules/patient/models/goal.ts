export class Goal {
    /* optional */
    private _steps?: number;
    private _calories?: number;
    private _distance?: number;
    private _active_minutes?: number;
    private _sleep?: number;

    get steps(): number {
        return this._steps
    }

    set steps(value: number) {
        this._steps = value
    }

    get calories(): number {
        return this._calories
    }

    set calories(value: number) {
        this._calories = value
    }

    get distance(): number {
        return this._distance
    }

    set distance(value: number) {
        this._distance = value
    }

    get active_minutes(): number {
        return this._active_minutes
    }

    set active_minutes(value: number) {
        this._active_minutes = value
    }

    get sleep(): number {
        return this._sleep
    }

    set sleep(value: number) {
        this._sleep = value
    }
}
