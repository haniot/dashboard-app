import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diseaseHistory',
  pure: true
})
export class DiseaseHistoryPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'yes':
        return 'HABITS.PIPES.DISEASE-HISTORY.YES';

      case 'no':
        return 'HABITS.PIPES.DISEASE-HISTORY.NO';

      default:
        return 'HABITS.PIPES.DO-NOT-KNOW';
    }

  }
}
