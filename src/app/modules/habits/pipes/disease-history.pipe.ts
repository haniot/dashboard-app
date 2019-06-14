import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diseaseHistory',
  pure: true
})
export class DiseaseHistoryPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'yes':
        return 'SIM';

      case 'no':
        return 'NÃO';

      default:
        return 'Não sei/Não lembro';
    }

  }
}
