import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'motherSchoolarity'
})
export class MotherSchoolarityPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'unlettered_elementary_one_incomplete':
                return 'Não alfabetizada';

            case 'elementary_one_elementary_two_incomplete':
                return 'Fundamental 1 incompleto';

            case 'elementary_two_high_school_incomplete':
                return 'Fundamental 2 incompleto';

            case 'medium_graduation_incomplete':
                return 'Médio incompleto';

            case 'graduation_complete':
                return 'Superior completo';

            case undefined:
                return 'Fora dos parâmetros';

            default:
                return 'NÂO ENCONTRADO';
        }

    }
}
