import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'myDate'
})
export class MyDatePipe implements PipeTransform {

    constructor(private translateService: TranslateService) { }

    transform(value: any, args?: any): any {
        const date = new Date(value);
        const currentLang = this.translateService.currentLang;
        return date.toLocaleDateString(currentLang) + ' ' + this.translateService.instant('MYDATEPIPE.AT') + ' ' + date.toLocaleTimeString(currentLang) + ' ' + this.translateService.instant('MYDATEPIPE.HOURS');
    }

}
