import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'evaluationStatus',
    pure: true
})
export class EvaluationStatustPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'complete':
                return 'EVALUATION.STATUS-COMPLETE';

            case 'incomplete':
                return 'EVALUATION.STATUS-INCOMPLETE';

            default:
                return 'SHARED.PIPES.UNDEFINED';
        }

    }
}
