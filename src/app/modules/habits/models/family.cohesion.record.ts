export enum Frequency {
    almost_never = 'almost_never',
    rarely = 'rarely',
    sometimes = 'sometimes',
    often = 'often',
    almost_aways = 'almost_aways'
}

export class FamilyCohesionRecord {
    family_mutual_aid_freq: Frequency;
    friendship_approval_freq: Frequency;
    family_only_task_freq: Frequency;
    family_only_preference_freq: Frequency;
    free_time_together_freq: Frequency;
    family_proximity_perception_freq: Frequency;
    all_family_tasks_freq: Frequency;
    family_tasks_opportunity_freq: Frequency;
    family_decision_support_freq: Frequency;
    family_union_relevance_freq: Frequency;
    family_cohesion_result: number;

    constructor() {
        this.family_mutual_aid_freq = Frequency.almost_never;
        this.friendship_approval_freq = Frequency.almost_never;
        this.family_only_task_freq = Frequency.almost_never;
        this.family_only_preference_freq = Frequency.almost_never;
        this.free_time_together_freq = Frequency.almost_never;
        this.family_proximity_perception_freq = Frequency.almost_never;
        this.all_family_tasks_freq = Frequency.almost_never;
        this.family_tasks_opportunity_freq = Frequency.almost_never;
        this.family_decision_support_freq = Frequency.almost_never;
        this.family_union_relevance_freq = Frequency.almost_never;
        this.family_cohesion_result = 0;
    }

}
