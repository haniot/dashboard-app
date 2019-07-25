

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weeklyFood',
  pure: true
})
export class WeeklyFoodPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'fish_chicken_meat':
        return 'HABITS.PIPES.WEEKLY-FOOD.FISH-CHICKEN-MEAT';

      case 'soda':
        return 'HABITS.PIPES.WEEKLY-FOOD.SODA';

      case 'salad_vegetable':
        return 'HABITS.PIPES.WEEKLY-FOOD.SALAD-VEGETABLE';

      case 'fried_salt_food':
        return 'HABITS.PIPES.WEEKLY-FOOD.FRIED-SALT-FOOD';

      case 'milk':
        return 'HABITS.PIPES.WEEKLY-FOOD.MILK';

      case 'bean':
        return 'HABITS.PIPES.WEEKLY-FOOD.BEAN';

      case 'fruits':
        return 'HABITS.PIPES.WEEKLY-FOOD.FRUITS';

      case 'candy_sugar_cookie':
        return 'HABITS.PIPES.WEEKLY-FOOD.CANDY-SUGAR-COOKIE';
      
      case 'burger_sausage':
        return 'HABITS.PIPES.WEEKLY-FOOD.BURGER-SAUSAGE';

      case undefined:
        return 'HABITS.PIPES.UNDEFINED';

      default:
        return 'HABITS.PIPES.NOTFOUND';
    }

  }
}
