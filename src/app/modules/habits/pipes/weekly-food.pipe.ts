

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weeklyFood',
  pure: true
})
export class WeeklyFoodPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'fish_chicken_meat':
        return 'Peixe, frango ou carne vermelha';

      case 'soda':
        return 'Refrigerante';

      case 'salad_vegetable':
        return 'Salada, legumes ou vegetais';

      case 'fried_salt_food':
        return 'Salgados fritos';

      case 'milk':
        return 'Leite';

      case 'bean':
        return 'Feijão';

      case 'fruits':
        return 'Frutas';

      case 'candy_sugar_cookie':
        return 'Guloseimas';
      
      case 'burger_sausage':
        return 'Hamburgues, salsicha ou outros embutidos';

      case undefined:
        return 'Fora dos parâmetros';

      default:
        return 'NÂO ENCONTRADO';
    }

  }
}
