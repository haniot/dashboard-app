import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'foodAllergy'
})
export class FoodAllergyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'gluten':
                return 'Glúten';

            case 'aplv':
                return 'APLV';

            case 'lactose':
                return 'Lactose';

            case 'dye':
                return 'Corante';

            case 'egg':
                return 'Ovos';

            case 'peanut':
                return 'Amendoim';

            case 'other':
                return 'Outro';

            default:
                return 'Não sei/Não lembro';
        }

    }
}
