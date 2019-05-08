import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'motherSchoolarity'
})
export class MotherSchoolarityPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'unlettered':
                return 'Analfabeta';

            case 'elementary_1_to_3':
                return 'Fundamental do 1° ao 3°';

            case 'elementary_4_to_7':
                return 'Fundamental do 4° ao 7°';

            case 'elementary_complete':
                return 'Fundamental Completo';

            case 'high_school_incomplete':
                return 'Ensino Médio Incompleto';

            case 'high_school_complete':
                return 'Ensino Médio Completo';

            case 'undefined':
                return 'Não respondido';

            default:
                return 'NÂO ENCONTRADO';
        }

    }
}