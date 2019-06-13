import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'motherSchoolarity'
})
export class MotherSchoolarityPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'unlettered_elementary_one_incomplete':
                return 'Analfabeto/\nFundamental 1 Incompleto';

            case 'elementary_one_elementary_two_incomplete':
                return 'Fundamental 1 Completo/\nFundamental 2 Incompleto';

            case 'elementary_two_high_school_incomplete':
                return 'Fundamental 2 Completo/\nMédio Incompleto';

            case 'medium_graduation_incomplete':
                return 'Médio Completo/\nSuperior Incompleto';

            case 'graduation_complete':
                return 'Superior Completo';

            default:
                return 'Fora dos parâmetros';
        }

    }
}
