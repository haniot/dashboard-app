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
        return 'Fórmula infantil';

      case 'other':
        return 'Outro';

      case undefined:
        return 'Fora dos parâmetros';

      default:
        return 'NÂO ENCONTRADO';
    }

  }

}
