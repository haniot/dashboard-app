import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'

@Pipe({
    name: 'activeMinutes'
})
export class ActiveMinutesPipe implements PipeTransform {

    constructor(private translateService: TranslateService) {

    }

    transform(value: any, ...args: any[]): any {
        const min = this.translateService.instant('HABITS.SLEEP.MINUTES-ABBREVIATION');
        if (value >= 1440) {
            const and = this.translateService.instant('SHARED.AND');
            const hours = this.translateService.instant('HABITS.SLEEP.TIME-ABBREVIATION');
            const days_trucate = Math.floor(value / 1440);
            const rest = Math.floor((value % 1440));
            return `${days_trucate ? days_trucate + 'dias ' : ''}${rest ? ' ' + and + ' ' + rest + hours : ''}`;
        }
        if (value >= 60) {
            const and = this.translateService.instant('SHARED.AND');
            const hours = this.translateService.instant('HABITS.SLEEP.TIME-ABBREVIATION');
            const hours_trucate = Math.floor(value / 60);
            const rest = Math.floor((value % 60));
            return `${hours_trucate ? hours_trucate + hours + ' ' : ''}${rest ? ' ' + and + ' ' + rest + min : ''}`;
        }
        return `${value + min}`;
    }

}
