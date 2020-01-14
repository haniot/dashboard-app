import { TimeSeriesType } from './time.series'

export class IntradayTimeSeries {
    /* required */
    private _data_set: Array<IntradayItem>;
    /* readonly */
    private readonly _summary: IntradaySummary | IntradayHeartRateSummary;
    private readonly _type: TimeSeriesType;

    get data_set(): Array<IntradayItem> {
        return this._data_set
    }

    get summary(): IntradaySummary | IntradayHeartRateSummary {
        return this._summary
    }

    get type(): TimeSeriesType {
        return this._type
    }
}

export class IntradayItem {
    /* required */
    private _value: number;
    private _time: string;

    get value(): number {
        return this._value
    }

    set value(value: number) {
        this._value = value
    }

    get time(): string {
        return this._time
    }

    set time(time: string) {
        this._time = time
    }
}

export class IntradaySummary {
    /* readonly */
    private readonly _total: number
    private readonly _start_time: string;
    private readonly _end_time: string;
    private readonly _interval: string;

    get total(): number {
        return this._total
    }

    get start_time(): string {
        return this._start_time
    }

    get end_time(): string {
        return this._end_time
    }

    get interval(): string {
        return this._interval
    }
}

export class IntradayHeartRateSummary {
    /* readonly */
    private readonly _start_time: string
    private readonly _end_time: string
    private readonly _max: number;
    private readonly _min: number;
    private readonly _average: number;
    private readonly _interval: string;

    get start_time(): string {
        return this._start_time
    }

    get end_time(): string {
        return this._end_time
    }

    get max(): number {
        return this._max
    }

    get min(): number {
        return this._min
    }

    get average(): number {
        return this._average
    }

    get interval(): string {
        return this._interval
    }
}
