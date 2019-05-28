import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toothType'
})
export class ToothTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'deciduous_tooth':
        return 'Dente decíduo';

      case 'permanent_tooth':
        return 'Dente permante';

      case 'undefined':
        return 'Não respondido';

      default:
        return 'NÂO ENCONTRADO';
    }

  }
}