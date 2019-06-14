import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'evaluationStatus',
    pure: true
})
export class EvaluationStatustPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'complete':
                return 'COMPLETA';

            case 'incomplete':
                return 'INCOMPLETA';

            default:
                return 'Fora dos padrões definidos';
        }

    }
}
