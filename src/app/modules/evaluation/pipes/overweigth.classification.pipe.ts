import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'overweigthClassification',
    pure: true
})
export class OverweigthClassificationPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {

            case 'normal':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.OVERWEIGHT.NORMAL';

            case 'overweight_obesity_risk':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.OVERWEIGHT.OVERWEIGHT-OBESITY-RISK';

            default:
                return 'SHARED.PIPES.UNDEFINED';
        }
    }

}
