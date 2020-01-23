import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'

@Pipe({
    name: 'distance'
})
export class DistancePipe implements PipeTransform {

    constructor(private translateService: TranslateService) {

    }

    transform(value: any, ...args: any[]): any {
        if (value >= 1000) {
            const and = this.translateService.instant('SHARED.AND');
            const distance_trucate = Math.floor(value / 1000);
            const rest = Math.floor((value % 1000));
            return `${distance_trucate ? distance_trucate + 'Km ' : ''}${rest ? ' ' + and + ' ' + rest + 'm' : ''}`;
        }

        return `${Math.floor(value) + 'm'}`;
    }

}
