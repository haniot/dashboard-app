import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'frequency'
})
export class FrequencyFamilyCohesionPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'almost_never':
                return 'Quase nunca';

            case 'rarely':
                return 'Raramente';

            case 'sometimes':
                return 'As vezes';

            case 'often':
                return 'Frequentemente';

            case 'almost_aways':
                return 'Quase sempre';

            default:
                return 'NÂO ENCONTRADO';
        }

    }
}