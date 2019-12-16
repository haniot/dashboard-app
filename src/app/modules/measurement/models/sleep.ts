export class Sleep {
    private _id: string
    private _start_time: string
    private _end_time: string
    private _duration: number
    private _pattern: Pattern
    private _type: SleepType
    private _patient_id: string

    constructor() {
        this._id = '';
        this._start_time = '';
        this._end_time = '';
        this._duration = 0;
        this._pattern = new Pattern();
    }

    get id(): string {
        return this._id
    }

    set id(value: string) {
        this._id = value
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

    get pattern(): Pattern {
        return this._pattern
    }

    set pattern(value: Pattern) {
        this._pattern = value
    }

    get type(): SleepType {
        return this._type
    }

    set type(value: SleepType) {
        this._type = value
    }

    get patient_id(): string {
        return this._patient_id
    }

    set patient_id(value: string) {
        this._patient_id = value
    }
}

export class SleepStage {
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

export class Summary {
    private _asleep: SleepStage
    private _awake: SleepStage
    private _restless: SleepStage

    constructor() {
        this._asleep = new SleepStage();
        this._awake = new SleepStage();
        this._restless = new SleepStage();
    }

    get asleep(): SleepStage {
        return this._asleep
    }

    set asleep(value: SleepStage) {
        this._asleep = value
    }

    get awake(): SleepStage {
        return this._awake
    }

    set awake(value: SleepStage) {
        this._awake = value
    }

    get restless(): SleepStage {
        return this._restless
    }

    set restless(value: SleepStage) {
        this._restless = value
    }
}

export class DataSetElement {
    private _start_time: string
    private _name: string
    private _duration: number

    constructor() {
        this._start_time = '';
        this._name = '';
        this._duration = 0;
    }

    get start_time(): string {
        return this._start_time
    }

    set start_time(value: string) {
        this._start_time = value
    }

    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value
    }

    get duration(): number {
        return this._duration
    }

    set duration(value: number) {
        this._duration = value
    }
}

export class Pattern {
    private _data_set: DataSetElement[]
    private _summary: Summary

    constructor() {
        this._data_set = []
        this._summary = new Summary()
    }

    get data_set(): any[] {
        return this._data_set
    }

    set data_set(value: any[]) {
        this._data_set = value
    }

    get summary(): Summary {
        return this._summary
    }

    set summary(value: Summary) {
        this._summary = value
    }
}

export enum SleepType {
    classic = 'classic',
    stages = 'stages'
}

