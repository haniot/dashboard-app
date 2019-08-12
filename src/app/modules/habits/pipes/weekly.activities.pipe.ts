import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'weeklyActivity',
    pure: true
})
export class WeeklyActivityPipe implements PipeTransform {

    transform(value: any, args?: any): any {

        switch (value) {

            case 'soccer':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.SOCCER';

            case 'futsal':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.FUTSAL';

            case 'handball':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.HANDBALL';

            case 'basketball':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.BASKETBALL';

            case 'skates':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.SKATES';

            case 'athletics':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.ATHLETICS';

            case 'swimming':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.SWIM';

            case 'gymnastics':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.GYMNASTICS';

            case 'fight':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.FIGHT';

            case 'dance':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.DANCE';

            case 'run':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.RUN';

            case 'ride a bike':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.RIDE-BIKE';

            case 'walking as a physical exercise':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.WALKING-PHYSICAL-EXERCISE';

            case 'walking as a means of transport':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.WALKING-MEANS-TRANSPORT';

            case 'volleyball':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.VOLLEYBALL';

            case 'musculation':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.MUSCULATION';

            case 'abdominal exercise':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES-ABDOMINAL-EXERCISE';

            case 'tennis':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.TENNIS';

            case 'walk with dog':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.WALK-WITH-DOG';

            case 'gymnastics gym':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.GYMNASTICS-GYM';

            case 'no activity':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.NO-ACTIVITY';

            case undefined:
                return 'HABITS.PIPES.UNDEFINED';

            default:
                return 'HABITS.PIPES.NOTFOUND';
        }

    }
}

