import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breastFeeding',
  pure: true
})
export class BreastFeedingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'exclusive':
        return 'HABITS.PIPES.BREAST-FEEDING.EXCLUSIVE';

      case 'complementary':
        return 'HABITS.PIPES.BREAST-FEEDING.COMPLEMENTARY';

      case 'infant_formulas':
        return 'HABITS.PIPES.BREAST-FEEDING.INFANT-FORMULAS';

      case 'other':
        return 'HABITS.PIPES.BREAST-FEEDING.OTHER';

      default:
        return 'HABITS.PIPES.DO-NOT-KNOW';
    }

  }

}
