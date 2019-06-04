import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'convertInAge'
})
export class ConvertInAgePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const date_current = new Date();

        return date_current.getFullYear() - value.substring(0,4) + ' ANOS';
    }
}
