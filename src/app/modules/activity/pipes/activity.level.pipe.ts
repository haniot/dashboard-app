import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'activityLevel'
})
export class ActivityLevelPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        switch (`${value}`.toLowerCase()) {
            case 'sedentary':
                return 'ACTIVITY.PIPES.ACTIVITY-LEVEL.SEDENTARY';

            case 'light':
                return 'ACTIVITY.PIPES.ACTIVITY-LEVEL.LIGHT';

            case 'fairly':
                return 'ACTIVITY.PIPES.ACTIVITY-LEVEL.FAIRLY';

            case 'very':
                return 'ACTIVITY.PIPES.ACTIVITY-LEVEL.VERY';

            default:
                return value;
        }
    }

}
