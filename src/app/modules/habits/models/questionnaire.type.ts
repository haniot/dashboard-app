export enum QuestionnairesCategory {
    sociodemographic_recod = 'sociodemographic_recod',
    family_cohesion_record = 'family_cohesion_record',
    oral_health_record = 'oral_health_record',
    sleep_habit = 'sleep_habit',
    physical_activity_habits = 'physical_activity_habits',
    feeding_habits_record = 'feeding_habits_record',
    medical_record = 'medical_record'
}

export class QuestionnaireGenericType {
    id: string;
    display_name: string;

    constructor() {
        this.id = '';
        this.display_name = '';
    }
}


export class QuestionnaireType {
    nutritional: Array<QuestionnaireGenericType>
    odontological: Array<QuestionnaireGenericType>

    constructor() {
        this.nutritional = new Array<QuestionnaireGenericType>();
        this.odontological = new Array<QuestionnaireGenericType>();
    }

}
