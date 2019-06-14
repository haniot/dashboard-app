import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'bloodpressureClassification',
    pure: true
})
export class BloodpressureClassificationPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'normal':
                return 'Normal';

            case 'borderline':
                return 'Limítrofe';

            case 'hypertension_stage_1':
                return 'Hipertensão estágio 1';

            case 'hypertension_stage_2':
                return 'Hipertensão estágio 2';

            default:
                return 'Fora dos padrões definidos';
        }
    }
}
