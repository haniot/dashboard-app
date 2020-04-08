import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataTypes'
})
export class DataTypesPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): unknown {
        switch (value) {
            case 'physical_activity':
                return 'ACTIVITY.PHYSICAL-ACTIVITY.TITLE';

            case 'sleep':
                return 'ACTIVITY.SLEEP.SLEEP';

            case 'quest_nutritional':
                return 'PATIENTS.VIEW-HABITS.NUTRITIONAL-QUESTIONNAIRE';

            case 'quest_odontological':
                return 'PATIENTS.VIEW-HABITS.ODONTOLOGICAL-QUESTIONNAIRE';

            default:
                return 'ACTIVITY.PIPES.NOTFOUND';
        }
    }

}
