import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'bloodpressureClassification',
    pure: true
})
export class BloodpressureClassificationPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'normal':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.BLOOD-PRESSURE.NORMAL';

            case 'borderline':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.BLOOD-PRESSURE.BORDERLINE';

            case 'hypertension_stage_1':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.BLOOD-PRESSURE.HYPERTENSION-STAGE-1';

            case 'hypertension_stage_2':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.BLOOD-PRESSURE.HYPERTENSION-STAGE-2';

            default:
                return 'SHARED.PIPES.UNDEFINED';
        }
    }
}
