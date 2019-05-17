import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bloodglucoseClassification'
})
export class BloodglucoseClassificationPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'good':
        return 'Bom';

      case 'great':
        return 'Ótimo';

      case 'undefined':
        return 'Não respondido';

      default:
        return 'NÂO ENCONTRADO';
    }
  }

}