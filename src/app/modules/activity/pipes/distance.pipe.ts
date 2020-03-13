import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { DomSanitizer } from '@angular/platform-browser'
import { DecimalPipe } from '@angular/common'

@Pipe({
    name: 'distance'
})
export class DistancePipe implements PipeTransform {

    constructor(
        private translateService: TranslateService,
        private decimalPipe: DecimalPipe,
        private sanitizer: DomSanitizer) {

    }

    transform(value: any, ...args: any[]): any {
        if (value >= 1000) {
            const distance_trucate = value / 1000;
            const result = this.decimalPipe.transform(distance_trucate, '1.2-2', 'en-US') + ' <small>km</small>}';
            return this.sanitizer.bypassSecurityTrustHtml(result);
        }
        // const and = this.translateService.instant('SHARED.AND');
        // const distance_trucate = value / 1000;
        // const rest = Math.floor((value % 1000));
        // const result = `${distance_trucate ? distance_trucate + '<small>km</small>' : ''}
        //     ${rest ? ' ' + and + ' ' + rest + '<small>m</small>' : ''}`;
        // return this.sanitizer.bypassSecurityTrustHtml(result);
        return this.sanitizer.bypassSecurityTrustHtml(`${Math.floor(value)}<small>m</small>`);
    }

}
