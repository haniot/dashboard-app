import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meal'
})
export class MealPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'preprandial':
        return 'Pré-prandial';

      case 'postprandial':
        return 'Pós-prandial';

      case 'fasting':
        return 'Jejum';

      case 'casual':
        return 'Casual';

      case 'bedtime':
        return 'Antes de dormir';
        
      case undefined:
        return '';

        default:
        return 'NÂO ENCONTRADO';
    }

  }
}