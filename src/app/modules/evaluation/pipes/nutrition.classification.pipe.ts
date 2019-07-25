import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'nutritionClassification',
    pure: true
})
export class NutritionClassificationtPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'accentuated_thinness':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.CLASSIFICATION.ACCENTUATED-THINNESS';

            case 'thinness':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.CLASSIFICATION.THINNESS';

            case 'eutrophy':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.CLASSIFICATION.EUTROPHY';

            case 'overweight':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.CLASSIFICATION.OVERWEIGHT';

            case 'obesity':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.CLASSIFICATION.OBESITY';

            case 'severe_obesity':
                return 'EVALUATION.NUTRITION-EVALUATION.PIPES.CLASSIFICATION.SEVERE-OBESITY';

            default:
                return 'SHARED.PIPES.UNDEFINED';
        }

    }
}
