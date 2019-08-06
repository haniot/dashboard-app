import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'bloodglucoseClassification',
    pure: true
})
export class BloodglucoseClassificationPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'good':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.BLOOD-GLUCOSE.GOOD';

            case 'great':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.BLOOD-GLUCOSE.GREAT';

            default:
                return 'SHARED.PIPES.UNDEFINED';
        }
    }

}
