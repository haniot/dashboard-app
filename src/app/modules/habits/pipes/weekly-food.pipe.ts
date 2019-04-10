

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weeklyFood'
})
export class WeeklyFoodPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'fish, chicken or red meat':
        return 'Peixe, frango ou carne vermelha';

      case 'soda':
        return 'Refrigerante';

      case 'raw salad, greens or vegetables':
        return 'Salada, legumes ou vegetais';

      case 'fried':
        return 'Salgados fritos';

      case 'milk':
        return 'Leite';

      case 'bean':
        return 'Feijão';

      case 'fruits':
        return 'Frutas';

      case 'goodies':
        return 'Guloseimas';
      
      case 'hamburger or sausages':
        return 'Hamburgues, salsicha ou outros embutidos';

      case undefined:
        return 'Não respondido';

      case 'undefined':
        return 'Não respondido';

      default:
        return 'NÂO ENCONTRADO';
    }

  }
}
/*
public static final String FISH_CHICKEN_BEEF = "fish, chicken or red meat";
public static final String SODA = "soda";
public static final String SALAD = "raw salad, greens or vegetables";
public static final String FRIED = "fried";
public static final String MILK = "milk";
public static final String BEAN = "bean";
public static final String FRUITS = "fruits";
public static final String GOODIES = "goodies";
public static final String HAMBURGER_SAUSAGE_OTHERS = "hamburger or sausages";
*/
