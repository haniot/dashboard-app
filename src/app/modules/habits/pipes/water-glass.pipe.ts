import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'waterGlass'
})
export class WaterGlassPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'none':
        return 'Nenhum';

      case 'one_two':
        return 'Entre um e dois';

      case 'three_four':
        return 'Entre três e quatro';

      case 'five_more':
        return 'Cinco ou mais';

      default:
        return 'Não sei/Não lembro';
    }

  }
}
