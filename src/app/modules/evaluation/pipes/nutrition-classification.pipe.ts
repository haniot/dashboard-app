import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'nutritionClassification',
    pure: true
})
export class NutritionClassificationtPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'accentuated_thinness':
                return 'Magreza acentuada';

            case 'thinness':
                return 'Magreza';

            case 'eutrophy':
                return 'Eutrofia';

            case 'overweight':
                return 'Excesso de peso';

            case 'obesity':
                return 'Obesidade';

            case 'severe_obesity':
                return 'Obesidade grave';

            default:
                return 'Fora dos padrões definidos';
        }

    }
}
