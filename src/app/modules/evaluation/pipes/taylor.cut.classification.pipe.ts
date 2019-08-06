import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'taylorCutClassification',
    pure: true
})
export class TaylorCutClassificationPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'normal':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.TAYLOR-CUT.NORMAL';

            case 'out_of_normality':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.TAYLOR-CUT.OUT-OF-NORMALITY';

            default:
                return 'SHARED.PIPES.UNDEFINED';
        }
    }

}
