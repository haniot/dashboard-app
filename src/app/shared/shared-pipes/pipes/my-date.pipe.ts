import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'myDate'
})
export class MyDatePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const date = new Date(value);
        return date.toLocaleDateString('pt-BR') + ' as ' + date.toLocaleTimeString('pt-BR') + ' horas.';
    }

}
