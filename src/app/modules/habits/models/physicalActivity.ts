enum ActivityFrequency {
    one_per_week, two_per_week, three_per_week, four_more_per_week, none
}
export class PhysicalActivityHabitsRecord{
    id: string;
    created_at: string;
    school_activity_freq: string;
    weekly_activities: Array<string>;
}