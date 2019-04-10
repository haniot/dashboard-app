

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breakFast'
})
export class BreakFastPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'never':
        return 'Nunca';

      case 'sometimes':
        return 'As vezes';

      case 'almost_everyday':
        return 'Quase todos os dias';

      case 'everyday':
        return 'Todos os dias';

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