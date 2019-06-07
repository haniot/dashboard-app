export enum Frequency {
    almost_never = "almost_never",
    rarely = "rarely",
    sometimes = "sometimes",
    often = "often",
    almost_aways = "almost_aways"
}

export class FamilyCohesionRecord {
    id: string;
    created_at: string;
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
}