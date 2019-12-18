export class TimeSeries {
    /* required */
    // TODO: Remover juntos com os mocks
    // private _data_set: Array<TimeSeriesItem | HeartRateZoneItem>;
    private _data_set: Array<any>;
    /* readonly */
    private readonly _summary: Summary | HeartRateSummary;
    private readonly _type: TimeSeriesType;


    get data_set(): Array<any> {
        return this._data_set
    }

    get summary(): Summary | HeartRateSummary {
        return this._summary
    }

    get type(): TimeSeriesType {
        return this._type
    }

    set data_set(value: Array<any>) {
        this._data_set = value
    }
}

export enum TimeSeriesType {
    steps = 'steps',
    calories = 'calories',
    distance = 'distance',
    active_minutes = 'active_minutes',
    heart_rate = 'heart_rate'
}

export class TimeSeriesItem {
    /* required */
    private _value: number;
    private _date: string;

    get value(): number {
        return this._value
    }

    set value(value: number) {
        this._value = value
    }

    get date(): string {
        return this._date
    }

    set date(value: string) {
        this._date = value
    }
}

export class Summary {
    /* readonly */
    private readonly _total: number

    get total(): number {
        return this._total
    }
}

export class HeartRateSummary {
    /* readonly */
    private readonly _fat_burn_total: number;
    private readonly _cardio_total: number;
    private readonly _peak_total: number;
    private readonly _out_of_range_total: number;

    get fat_burn_total(): number {
        return this._fat_burn_total
    }

    get cardio_total(): number {
        return this._cardio_total
    }

    get peak_total(): number {
        return this._peak_total
    }

    get out_of_range_total(): number {
        return this._out_of_range_total
    }
}

export class HeartRateZoneItem {
    /* required */
    private _fat_burn_total: HeartRateZoneData;
    private _cardio_total: HeartRateZoneData;
    private _peak_total: HeartRateZoneData;
    private _out_of_range_total: HeartRateZoneData;


    get fat_burn_total(): HeartRateZoneData {
        return this._fat_burn_total
    }

    set fat_burn_total(value: HeartRateZoneData) {
        this._fat_burn_total = value
    }

    get cardio_total(): HeartRateZoneData {
        return this._cardio_total
    }

    set cardio_total(value: HeartRateZoneData) {
        this._cardio_total = value
    }

    get peak_total(): HeartRateZoneData {
        return this._peak_total
    }

    set peak_total(value: HeartRateZoneData) {
        this._peak_total = value
    }

    get out_of_range_total(): HeartRateZoneData {
        return this._out_of_range_total
    }

    set out_of_range_total(value: HeartRateZoneData) {
        this._out_of_range_total = value
    }
}

export class HeartRateZoneData {
    /* required */
    private _min: number
    private _max: number
    /* optional */
    private _duration?: number;

    get min(): number {
        return this._min
    }

    set min(value: number) {
        this._min = value
    }

    get max(): number {
        return this._max
    }

    set max(value: number) {
        this._max = value
    }

    get duration(): number {
        return this._duration
    }

    set duration(value: number) {
        this._duration = value
    }
}

export class TimeSeriesSimpleFilter {
    private _start_date: string;
    private _end_date: string;

    get start_date(): string {
        return this._start_date
    }

    set start_date(value: string) {
        this._start_date = value
    }

    get end_date(): string {
        return this._end_date
    }

    set end_date(value: string) {
        this._end_date = value
    }
}

export class TimeSeriesIntervalFilter {
    private _date: string;
    private _interval: string;

    get date(): string {
        return this._date
    }

    set date(value: string) {
        this._date = value
    }

    get interval(): string {
        return this._interval
    }

    set interval(value: string) {
        this._interval = value
    }
}


export class TimeSeriesFullFilter {
    private _start_date: string;
    private _end_date: string;
    private _start_time: string;
    private _end_time: string;
    private _interval: string;

    get start_date(): string {
        return this._start_date
    }

    set start_date(value: string) {
        this._start_date = value
    }

    get end_date(): string {
        return this._end_date
    }

    set end_date(value: string) {
        this._end_date = value
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

    get interval(): string {
        return this._interval
    }

    set interval(value: string) {
        this._interval = value
    }
}
