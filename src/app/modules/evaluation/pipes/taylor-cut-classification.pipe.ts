import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'taylorCutClassification'
})
export class TaylorCutClassificationPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'normal':
                return 'Normal';

            case 'out_of_normality':
                return 'Fora da normalidade';

            default:
                return 'Não identificado';
        }
    }

}
