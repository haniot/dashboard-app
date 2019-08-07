export enum WeeklyFrequency {
    never = 'never',
    no_day = 'no_day',
    one_two_days = 'one_two_days',
    three_four_days = 'three_four_days',
    five_six_days = 'five_six_days',
    all_days = 'all_days',
    undefined = 'undefined'
}

export enum QuantityWaterGlass {
    none = 'none',
    one_two = 'one_two',
    three_four = 'three_four',
    five_more = 'five_more',
    undefined = 'undefined'
}

export enum Breastfeeding {
    exclusive = 'exclusive',
    complementary = 'complementary',
    infant_formulas = 'infant_formulas',
    other = 'other',
    undefined = 'undefined'
}

export enum FoodAllergy {
    gluten = 'gluten',
    aplv = 'aplv',
    lactose = 'lactose',
    dye = 'dye',
    egg = 'egg',
    peanut = 'peanut',
    other = 'other',
    undefined = 'undefined'
}

export enum Breakfast {
    never = 'never',
    sometimes = 'sometimes',
    almost_everyday = 'almost_everyday',
    everyday = 'everyday',
    undefined = 'undefined'
}

export class WeeklyFoodRecord {
    food: string;
    seven_days_freq: WeeklyFrequency;
}

export class FeedingHabitsRecord {
    weekly_feeding_habits: Array<WeeklyFoodRecord>;
    daily_water_glasses: QuantityWaterGlass;
    six_month_breast_feeding: Breastfeeding;
    food_allergy_intolerance: Array<FoodAllergy>;
    breakfast_daily_frequency: Breakfast;

    constructor() {
        this.weekly_feeding_habits = new Array<WeeklyFoodRecord>();
        this.daily_water_glasses = QuantityWaterGlass.none;
        this.six_month_breast_feeding = Breastfeeding.undefined;
        this.food_allergy_intolerance = new Array<FoodAllergy>();
        this.breakfast_daily_frequency = Breakfast.undefined;
    }

}
