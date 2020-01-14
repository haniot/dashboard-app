import { Activity } from './activity'

export class Sleep extends Activity {
    /* required */
    private _pattern: SleepPattern;
    private _type: SleepType;

    get pattern(): SleepPattern {
        return this._pattern
    }

    set pattern(value: SleepPattern) {
        this._pattern = value
    }

    get type(): SleepType {
        return this._type
    }

    set type(value: SleepType) {
        this._type = value
    }
}

export class SleepPatternSummaryData {
    private _count: number
    private _duration: number

    constructor() {
        this._count = 0
        this._duration = 0
    }

    get count(): number {
        return this._count
    }

    set count(value: number) {
        this._count = value
    }

    get duration(): number {
        return this._duration
    }

    set duration(value: number) {
        this._duration = value
    }
}

export class SleepPatternPhaseSummary {
    private _awake: SleepPatternSummaryData
    private _asleep: SleepPatternSummaryData
    private _restless: SleepPatternSummaryData

    get asleep(): SleepPatternSummaryData {
        return this._asleep
    }

    set asleep(value: SleepPatternSummaryData) {
        this._asleep = value
    }

    get awake(): SleepPatternSummaryData {
        return this._awake
    }

    set awake(value: SleepPatternSummaryData) {
        this._awake = value
    }

    get restless(): SleepPatternSummaryData {
        return this._restless
    }

    set restless(value: SleepPatternSummaryData) {
        this._restless = value
    }
}

export class SleepPatternStageSummary {
    private _deep: SleepPatternSummaryData;
    private _light: SleepPatternSummaryData;
    private _rem: SleepPatternSummaryData;
    private _awake: SleepPatternSummaryData;

    get deep(): SleepPatternSummaryData {
        return this._deep
    }

    set deep(value: SleepPatternSummaryData) {
        this._deep = value
    }

    get light(): SleepPatternSummaryData {
        return this._light
    }

    set light(value: SleepPatternSummaryData) {
        this._light = value
    }

    get rem(): SleepPatternSummaryData {
        return this._rem
    }

    set rem(value: SleepPatternSummaryData) {
        this._rem = value
    }

    get awake(): SleepPatternSummaryData {
        return this._awake
    }

    set awake(value: SleepPatternSummaryData) {
        this._awake = value
    }
}

export class SleepPatternDataSet {
    /* required */
    private _start_time: string
    private _name: SleepPhases | SleepStages;
    private _duration: number

    get start_time(): string {
        return this._start_time
    }

    set start_time(value: string) {
        this._start_time = value
    }

    get name(): SleepPhases | SleepStages {
        return this._name
    }

    set name(value: SleepPhases | SleepStages) {
        this._name = value
    }

    get duration(): number {
        return this._duration
    }

    set duration(value: number) {
        this._duration = value
    }
}

export enum SleepPhases {
    AWAKE = 'awake',
    ASLEEP = 'asleep',
    RESTLESS = 'restless'
}

export enum SleepStages {
    DEEP = 'deep',
    LIGHT = 'light',
    REM = 'rem',
    WAKE = 'wake'
}

export class SleepPattern {
    /* TODO: remover any ao remover os mocks*/
    private _data_set: SleepPatternDataSet[] | any[]
    private _summary: SleepPatternPhaseSummary | SleepPatternStageSummary | any;

    /* TODO: remover construtor ao remover os mocks*/
    constructor() {
        this._data_set = [];
        this._summary = new SleepPatternPhaseSummary();
    }

    get data_set(): SleepPatternDataSet[] | any[] {
        return this._data_set
    }

    set data_set(value: SleepPatternDataSet[] | any[]) {
        this._data_set = value
    }

    get summary(): SleepPatternPhaseSummary | SleepPatternStageSummary {
        return this._summary
    }

    set summary(value: SleepPatternPhaseSummary | SleepPatternStageSummary) {
        this._summary = value
    }
}

export enum SleepType {
    CLASSIC = 'classic',
    STAGES = 'stages'
}

