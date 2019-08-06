import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'weeklyFrequency',
    pure: true
})
export class WeeklyFrequencyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'never':
                return 'HABITS.PIPES.WEEKLY-FREQUENCY.NEVER';

            case 'no_day':
                return 'HABITS.PIPES.WEEKLY-FREQUENCY.IN-DAY';

            case 'one_two_days':
                return 'HABITS.PIPES.WEEKLY-FREQUENCY.ONE-TWO-DAYS';

            case 'three_four_days':
                return 'HABITS.PIPES.WEEKLY-FREQUENCY.THREE-FOUR-DAYS';

            case 'five_six_days':
                return 'HABITS.PIPES.WEEKLY-FREQUENCY.FIVE-SIX-DAYS';

            case 'all_days':
                return 'HABITS.PIPES.WEEKLY-FREQUENCY.ALL-DAYS';

            default:
                return 'HABITS.PIPES.DO-NOT-KNOW';
        }

    }
}
