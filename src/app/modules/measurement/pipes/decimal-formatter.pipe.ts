import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'decimalFormatter'
})
export class DecimalFormatterPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        try {
            return value.toFixed(1);
        } catch (e) {
            return value;
        }

    }

}
