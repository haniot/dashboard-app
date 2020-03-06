import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {

    constructor(
        private translateService: TranslateService,
        private sanitizer: DomSanitizer) {
    }

    transform(value: number, ...args: any[]): any {
        const hours = Math.floor((value / 3600000));
        const time_abbreviation = hours > 1 ? this.translateService.instant('HABITS.SLEEP.TIME-ABBREVIATION') : 'h';
        const time_rest = value % 3600000;
        const minutes = Math.floor((value % 3600000) / 60000);
        const minutes_abbreviation = minutes > 1 ? this.translateService.instant('HABITS.SLEEP.MINUTES-ABBREVIATION') : 'min';
        const and = this.translateService.instant('SHARED.AND');

        const html = `${(hours ? hours + '<small>' + time_abbreviation + '</small>' + ' ' + and + ' ' : '')} 
            ${(time_rest ? minutes + '<small>' + minutes_abbreviation + '</small>' : '')}`

        return this.sanitizer.bypassSecurityTrustHtml(html);

    }

}
