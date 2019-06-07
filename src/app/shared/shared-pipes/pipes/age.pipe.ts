import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'convertInAge'
})
export class ConvertInAgePipe implements PipeTransform {

    transform(value: any, args?: any): any {

        try {
            const birth_date = new Date(value);


            const date_current = new Date();


            return this.calculaIdade(birth_date, date_current);
        } catch (e) {
            const date_current = new Date();
            return date_current.getFullYear() - value.substring(0, 4) + ' ANOS';
        }


    }

    private calculaIdade(birth_date: Date, date_current: Date) {
        return `${date_current.getFullYear() - birth_date.getFullYear()} ANOS`;
    }
}
