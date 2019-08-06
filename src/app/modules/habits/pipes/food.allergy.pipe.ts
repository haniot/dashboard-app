import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'foodAllergy',
    pure: true
})
export class FoodAllergyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'gluten':
                return 'HABITS.PIPES.FOOD-ALLERGY.GLUTEN';

            case 'aplv':
                return 'HABITS.PIPES.FOOD-ALLERGY.APLV';

            case 'lactose':
                return 'HABITS.PIPES.FOOD-ALLERGY.LACTOSE';

            case 'dye':
                return 'HABITS.PIPES.FOOD-ALLERGY.DYE';

            case 'egg':
                return 'HABITS.PIPES.FOOD-ALLERGY.EGG';

            case 'peanut':
                return 'HABITS.PIPES.FOOD-ALLERGY.PEANUT';

            case 'other':
                return 'HABITS.PIPES.FOOD-ALLERGY.OTHER';

            default:
                return 'HABITS.PIPES.DO-NOT-KNOW';
        }

    }
}
