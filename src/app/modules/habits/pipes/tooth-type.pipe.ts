import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'toothType',
    pure: true
})
export class ToothTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'deciduous_tooth':
                return 'Dente decíduo';

            case 'permanent_tooth':
                return 'Dente permante';

            default:
                return 'Fora dos parâmetros';
        }

    }
}
