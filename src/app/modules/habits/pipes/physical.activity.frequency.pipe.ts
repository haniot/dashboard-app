import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'physicalActivity',
  pure: true
})
export class PhysicalActivityPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'one_per_week':
        return 'HABITS.PIPES.PHYSICAL-ACTIVITY-FREQUENCY.ONE-PER-WEEK';

      case 'two_per_week':
        return 'HABITS.PIPES.PHYSICAL-ACTIVITY-FREQUENCY.TWO-PER-WEEK';

      case 'three_per_week':
        return 'HABITS.PIPES.PHYSICAL-ACTIVITY-FREQUENCY.THREE-PER-WEEK';

      case 'four_more_per_week':
        return 'HABITS.PIPES.PHYSICAL-ACTIVITY-FREQUENCY.FOUR-MORE-PER-WEEK';

      case 'none':
        return 'HABITS.PIPES.PHYSICAL-ACTIVITY-FREQUENCY.NONE';

      case undefined:
        return 'HABITS.PIPES.UNDEFINED';

      default:
        return 'HABITS.PIPES.NOTFOUND';
    }

  }
}
