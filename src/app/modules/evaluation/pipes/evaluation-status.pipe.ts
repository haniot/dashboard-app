import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'evaluationStatus'
})
export class EvaluationStatustPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'complete':
        return 'COMPLETA';

      case 'incomplete':
        return 'INCOMPLETA';

      case 'undefined':
        return 'Não respondido';

      default:
        return 'NÂO ENCONTRADO';
    }

  }
}