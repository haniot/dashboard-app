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
        return 'NÃO';

      case undefined:
        return 'Fora dos parâmetros';

      default:
        return 'NÂO ENCONTRADO';
    }

  }
}
