import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
    name: 'distance'
})
export class DistancePipe implements PipeTransform {

    constructor(
        private translateService: TranslateService,
        private sanitizer: DomSanitizer) {

    }

    transform(value: any, ...args: any[]): any {
        if (value >= 1000) {
            const and = this.translateService.instant('SHARED.AND');
            const distance_trucate = Math.floor(value / 1000);
            const rest = Math.floor((value % 1000));
            const result = `${distance_trucate ? distance_trucate + '<small>km</small>' : ''}
            ${rest ? ' ' + and + ' ' + rest + '<small>m</small>' : ''}`;
            return this.sanitizer.bypassSecurityTrustHtml(result);
        }

        return this.sanitizer.bypassSecurityTrustHtml(`${Math.floor(value)}<small>m</small>`);
    }

}
