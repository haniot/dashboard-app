import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diseaseHistory'
})
export class DiseaseHistoryPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'yes':
        return 'SIM';

      case 'no':
        return 'Não';

      case undefined:
        return 'Não respondido';

      case 'undefined':
        return 'Não respondido';

      default:
        return 'NÂO ENCONTRADO';
    }

  }
}