import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'bloodpressureClassification'
})
export class BloodpressureClassificationPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'normal':
                return 'Normal';

            case 'pre_hypertension':
                return 'Limítrofe';

            case 'arterial_hypertension_stage_1':
                return 'Hipertensão estágio 1';

            case 'arterial_hypertension_stage_2':
                return 'Hipertensão estágio 2';

            case undefined:
                return 'Fora dos parâmetros';

            default:
                return 'Não identificado';
        }
    }
}
