import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breastFeeding'
})
export class BreastFeedingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'exclusive':
        return 'Exclusivo';

      case 'complementary':
        return 'Complementar';

      case 'infant_formulas':
        return 'Fórmulas infantis';

      case 'other':
        return 'Outros';

      default:
        return 'Não sei/Não lembro';
    }

  }

}
