import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'weeklyActivity',
    pure: true
})
export class WeeklyActivityPipe implements PipeTransform {

    transform(value: any, args?: any): any {

        switch (value) {

            case 'football':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.SOCCER';

            case 'futsal':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.FUTSAL';

            case 'handball':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.HANDBALL';

            case 'basketball':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.BASKETBALL';

            case 'roller_skate':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.SKATES';

            case 'athletics':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.ATHLETICS';

            case 'swimming':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.SWIM';

            case 'olympic_rhythmic_gymnastics':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.GYMNASTICS';

            case 'fight':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.FIGHT';

            case 'dance':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.DANCE';

            case 'run':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.RUN';

            case 'bike':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.RIDE-BIKE';

            case 'exercise_walking':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.WALKING-PHYSICAL-EXERCISE';

            case 'locomotion_walking':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.WALKING-MEANS-TRANSPORT';

            case 'volleyball':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.VOLLEYBALL';

            case 'bodybuilding':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.MUSCULATION';

            case 'abdominal':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES-ABDOMINAL-EXERCISE';

            case 'tennis':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.TENNIS';

            case 'dog_walk':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.WALK-WITH-DOG';

            case 'gym_exercise':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.GYMNASTICS-GYM';

            case 'none_activity':
                return 'HABITS.PIPES.WEEKLY-ACTIVITIES.NO-ACTIVITY';

            case undefined:
                return 'HABITS.PIPES.UNDEFINED';

            default:
                return 'HABITS.PIPES.NOTFOUND';
        }

    }
}

