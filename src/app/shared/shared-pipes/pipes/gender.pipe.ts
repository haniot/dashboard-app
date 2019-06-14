import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'gender',
    pure: true
})
export class GenderPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'male':
                return 'MASCULINO';

            case 'female':
                return 'FEMININO';

            case undefined:
                return 'Fora dos parâmetros';

            default:
                return 'NÂO ENCONTRADO';
        }

    }

}
