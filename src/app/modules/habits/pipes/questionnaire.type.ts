import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'questionnaireType',
    pure: true
})
export class QuestionnaireTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'sociodemographic_recod':
                return 'HABITS.PIPES.QUESTIONNAIRE-TYPE.SOCIO-DEMOGRAPHIC';

            case 'family_cohesion_record':
                return 'HABITS.PIPES.QUESTIONNAIRE-TYPE.FAMILY-COHESION';

            case 'oral_health_record':
                return 'HABITS.PIPES.QUESTIONNAIRE-TYPE.ORAL-HEALTH';

            case 'sleep_habit':
                return 'HABITS.PIPES.QUESTIONNAIRE-TYPE.SLEEP';

            case 'physical_activity_habits':
                return 'HABITS.PIPES.QUESTIONNAIRE-TYPE.PHYSICAL-ACTIVITY';

            case 'feeding_habits_record':
                return 'HABITS.PIPES.QUESTIONNAIRE-TYPE.FEEDING';

            case 'medical_record':
                return 'HABITS.PIPES.QUESTIONNAIRE-TYPE.MEDICAL';

            default:
                return 'HABITS.PIPES.DO-NOT-KNOW';
        }

    }
}
