export enum MotherSchoolarity {
    unlettered = 'unlettered',
    elementary_1_to_3 = 'elementary_1_to_3',
    elementary_4_to_7 = 'elementary_4_to_7',
    elementary_complete = 'elementary_complete',
    high_school_incomplete = 'high_school_incomplete',
    high_school_complete = 'high_school_complete',
    undefined = 'undefined'
}

export enum CorAndRace {
    white = 'white',
    black = 'black',
    parda = 'parda',
    yellow = 'yellow'
}

export class SocioDemographicRecord {
    id: string;
    created_at: string;
    color_race: CorAndRace;
    mother_scholarity: MotherSchoolarity;
    people_in_home: number;
}
