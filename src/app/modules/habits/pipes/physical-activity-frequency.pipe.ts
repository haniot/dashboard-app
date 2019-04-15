import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'physicalActivity'
})
export class PhysicalActivityPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'one_per_week':
        return 'Uma vez por semana';

      case 'two_per_week':
        return 'Duas vezes por semana';

      case 'three_per_week':
        return 'Trẽs vezes por semana';

      case 'four_more_per_week':
        return 'Quatro vezes por semana';

      case 'none':
        return 'Nenhuma vez';

      default:
        return 'NÂO ENCONTRADO';
    }

  }
}