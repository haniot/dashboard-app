import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'waterGlass',
  pure: true
})
export class WaterGlassPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'none':
        return 'HABITS.PIPES.WATER-GLASS.NONE';

      case 'one_two':
        return 'HABITS.PIPES.WATER-GLASS.ONE-TWO';

      case 'three_four':
        return 'HABITS.PIPES.WATER-GLASS.THREE-FOUR';

      case 'five_more':
        return 'HABITS.PIPES.WATER-GLASS.FIVE-MORE';

      default:
        return 'HABITS.PIPES.DO-NOT-KNOW';
    }

  }
}
