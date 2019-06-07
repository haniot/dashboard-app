import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weeklyFrequency'
})
export class WeeklyFrequencyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'never':
        return 'Nunca';

      case 'no_day':
        return 'No dia';

      case 'one_two_days':
        return 'Entre uma e duas vezes';

      case 'three_four_days':
        return 'Entre três e quatro vezes';

      case 'five_six_days':
        return 'Entre cinco e seis vezes';

      case 'all_days':
        return 'Todos os dias';

      case 'undefined':
        return 'Não respondido';

      default:
        return 'NÂO ENCONTRADO';
    }

  }
}
