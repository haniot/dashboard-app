import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { DomSanitizer } from '@angular/platform-browser'
import { DecimalPipe } from '@angular/common'

@Pipe({
    name: 'activeMinutes'
})
export class ActiveMinutesPipe implements PipeTransform {

    constructor(
        private translateService: TranslateService,
        private sanitizer: DomSanitizer,
        private numberPiper: DecimalPipe) {

    }

    transform(value: any, ...args: any[]): any {
        const min = this.translateService.instant('HABITS.SLEEP.MINUTES-ABBREVIATION');
        if (value >= 1440) {
            const and = this.translateService.instant('SHARED.AND');
            const day = this.translateService.instant('SHARED.DAY');
            const days = this.translateService.instant('SHARED.DAYS');
            const hours = this.translateService.instant('HABITS.SLEEP.TIME-ABBREVIATION');
            const daysTrucate = Math.floor(value / 1440);
            const daysTrucateFormatted = this.numberPiper.transform(daysTrucate, '1.0-0');
            const rest = Math.floor((value % 1440));
            const restFormatted = this.numberPiper.transform(rest, '1.0-0');
            const result = `${daysTrucate ? (`${daysTrucateFormatted}<small>${daysTrucate > 1 ? days : day}</small>`) : ''}
                ${rest ? (' ' + and + ' ' + restFormatted + `<small>${hours}</small>`) : ''}`;
            return this.sanitizer.bypassSecurityTrustHtml(result);
        }
        if (value >= 60) {
            const and = this.translateService.instant('SHARED.AND');
            const hours = this.translateService.instant('HABITS.SLEEP.TIME-ABBREVIATION');
            const hours_trucate = Math.floor(value / 60);
            const rest = Math.floor((value % 60));
            const result = `${hours_trucate ? hours_trucate + `<small>${hours_trucate > 1 ? hours : 'h'}</small>` : ''}
                ${rest ? ' ' + and + ' ' + rest + `<small>${min}</small>` : ''}`;
            return this.sanitizer.bypassSecurityTrustHtml(result);
        }

        return this.sanitizer.bypassSecurityTrustHtml(`${value}<small>${min}</small>`);
    }

}
