import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'decimalFormatter'
})
export class DecimalFormatterPipe implements PipeTransform {

    transform(value: any, args: any = 1): any {
        try {
            return value.toFixed(args);
        } catch (e) {
            return value;
        }

    }

}
