import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'millisecond'
})
export class MillisecondPipe implements PipeTransform {

    transform(value: number, ...args: any[]): any {
        const hours_trucate = Math.floor(value / 3600000);
        const minutes = Math.floor((value % 3600000) / 60000);

        return `${hours_trucate ? hours_trucate + 'h:' : ''}${minutes ? minutes + 'min' : '0 min'}`;
    }

}
