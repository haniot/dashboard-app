import { Activity, ActivityLevel, Levels } from './activity'
import { HeartRateZoneItem } from './time.series'

export class PhysicalActivity extends Activity {
    /* requied */
    private _name: string;
    private _calories: number;
    /* optional */
    private _steps?: number;
    private _distance?: number;
    private _levels?: ActivityLevel[];
    private _calories_link: string;
    private _heart_rate_link: string;
    private _heart_rate_average: number;
    private _heart_rate_zones: HeartRateZoneItem;

    constructor() {
        super();
        this._name = '';
        this._calories = 0;
        this._steps = 0;
        this._distance = 0;
        this._levels = [];
        this._heart_rate_link = '';
        this._heart_rate_average = 0;
        this._heart_rate_zones = new HeartRateZoneItem();
    }


    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value
    }

    get calories(): number {
        return this._calories
    }

    set calories(value: number) {
        this._calories = value
    }

    get steps(): number {
        return this._steps
    }

    set steps(value: number) {
        this._steps = value
    }

    get distance(): number {
        return this._distance
    }

    set distance(value: number) {
        this._distance = value
    }

    get levels(): ActivityLevel[] {
        return this._levels
    }

    set levels(value: ActivityLevel[]) {
        this._levels = value
    }

    get calories_link(): string {
        return this._calories_link
    }

    set calories_link(value: string) {
        this._calories_link = value
    }

    get heart_rate_link(): string {
        return this._heart_rate_link
    }

    set heart_rate_link(value: string) {
        this._heart_rate_link = value
    }

    get heart_rate_average(): number {
        return this._heart_rate_average
    }

    set heart_rate_average(value: number) {
        this._heart_rate_average = value
    }

    get heart_rate_zones(): HeartRateZoneItem {
        return this._heart_rate_zones
    }

    set heart_rate_zones(value: HeartRateZoneItem) {
        this._heart_rate_zones = value
    }
}
