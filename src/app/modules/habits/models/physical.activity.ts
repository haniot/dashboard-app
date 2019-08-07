export enum ActivityFrequency {
    one_per_week = 'one_per_week',
    two_per_week = 'two_per_week',
    three_per_week = 'three_per_week',
    four_more_per_week = 'four_more_per_week',
    none = 'none'
}

export class PhysicalActivityHabitsRecord {
    school_activity_freq: ActivityFrequency;
    weekly_activities: Array<string>;

    constructor() {
        this.school_activity_freq = ActivityFrequency.none;
        this.weekly_activities = ['run'];
    }
}
