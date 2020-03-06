import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'millisecond'
})
export class MillisecondPipe implements PipeTransform {

    transform(value: number, ...args: any[]): any {
        const hours_trucate = Math.floor(value / 3600000);
        const minutes = Math.floor((value % 3600000) / 60000);
        const seconds = Math.floor(((value % 3600000) % 60000) / 1000);
        return `${hours_trucate ? hours_trucate + 'h:' : ''}${minutes ? minutes + 'm:' : '0m'}${seconds ? seconds + 's' : '0s'}`;
    }

}
