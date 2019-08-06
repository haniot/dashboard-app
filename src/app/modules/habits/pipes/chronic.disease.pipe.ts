import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chronicDisease',
  pure: true
})
export class ChronicDiseasePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'hypertension':
        return 'HABITS.PIPES.CHORNIC-DISEASE.HYPERTENSION';

      case 'blood_fat':
        return 'HABITS.PIPES.CHORNIC-DISEASE.BLOOD-FAT';

      case 'diabetes':
        return 'HABITS.PIPES.CHORNIC-DISEASE.DIABETES';

      case undefined:
        return 'HABITS.PIPES.UNDEFINED';

      default:
        return 'HABITS.PIPES.NOTFOUND';
    }

  }
}
