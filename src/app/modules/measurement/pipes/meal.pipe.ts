import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meal',
  pure: true
})
export class MealPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'preprandial':
        return 'MEASUREMENTS.PIPES.MEAL.PREPRANDIAL';

      case 'postprandial':
        return 'MEASUREMENTS.PIPES.MEAL.POSTPRANDIAL';

      case 'fasting':
        return 'MEASUREMENTS.PIPES.MEAL.FASTING';

      case 'casual':
        return 'MEASUREMENTS.PIPES.MEAL.CASUAL';

      case 'bedtime':
        return 'MEASUREMENTS.PIPES.MEAL.BEDTIME';

      case undefined:
        return 'MEASUREMENTS.PIPES.UNDEFINED';

      default:
        return 'MEASUREMENTS.PIPES.NOTFOUND';
    }

  }
}
