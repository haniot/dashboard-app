
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'corAndRace'
})
export class CorAndRacePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'white':
                return 'Branco(a)';

            case 'black':
                return 'Negro(a)';

            case 'parda':
                return 'Pardo(a)';

            case 'yellow':
                return 'Amarelo(a)';

            case 'undefined':
                return 'Não respondido';

            default:
                return 'NÂO ENCONTRADO';
        }

    }
}