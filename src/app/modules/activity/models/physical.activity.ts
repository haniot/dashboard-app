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

    constructor(name?: string) {
        super();
        this._name = name ? name : 'Run';
        this._calories = 2500;
        this._steps = 254;
        this._distance = 1.5;
        this._levels = [
            new ActivityLevel(Levels.SEDENTARY, 1400500),
            new ActivityLevel(Levels.LIGHT, 1400500),
            new ActivityLevel(Levels.FAIRLY, 1400500),
            new ActivityLevel(Levels.VERY, 1400500)];
        this._heart_rate_link = '/v1/patients';
        this._heart_rate_average = 1250;
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
