import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'teethBushing'
})
export class TeethbushingPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'none':
                return 'Nenuma';

            case 'once':
                return 'Uma vez';

            case 'twice':
                return 'Duas vezes';

            case 'three_more':
                return 'Três vezes ou mais';

            case 'undefined':
                return 'Não respondido';

            default:
                return 'NÂO ENCONTRADO';
        }

    }
}