enum WeeklyFrequency{
    never, no_day, one_two_days, three_four_days, five_six_days, all_days, undefined
}

enum WaterGlass{
    none, one_two, three_four, five_more, undefined
}

enum Breastfeeding{
    exclusive, complementary, infant_formulas, other, undefined
}

enum FoodAllergy{
    gluten, aplv, lactose, dye, egg, peanut, other, undefined
}

enum Breakfast{
    never, sometimes, almost_everyday, everyday, undefined
}


export class WeeklyFoodRecord{
    food: string;
    seven_days_freq: string;
}

export class FeedingHabitsRecord{
    id: string;
    created_at: string;
    weekly_feeding_habits: Array<WeeklyFoodRecord>;
    daily_water_glasses: string;
    six_month_breast_feeding: string;
    food_allergy_intolerance: Array<string>;
    breakfast_daily_frequency: string;
}