import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chronicDisease'
})
export class ChronicDiseasePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'hypertension':
        return 'Hipertensão';

      case 'blood_fat':
        return 'Gordura no sangue';

      case 'diabetes':
        return 'Diabetes';

      case undefined:
        return 'Fora dos parâmetros';

      default:
        return 'NÂO ENCONTRADO';
    }

  }
}
