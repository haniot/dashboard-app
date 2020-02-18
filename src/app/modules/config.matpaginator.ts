import { MatPaginatorIntl, PageEvent } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from "@angular/core";

export const ConfigurationBasic = {
    pageSizeOptions: [10, 25, 100],
    page: 1,
    limit: 10
}

@Injectable()
export class PaginatorIntlService extends MatPaginatorIntl {
    translate: TranslateService;
    itemsPerPageLabel: string;
    nextPageLabel: string;
    previousPageLabel: string;

    getRangeLabel = function (page, pageSize, length) {
        const of = this.translate ? this.translate.instant('PAGINATOR.OF') : 'de';
        if (length === 0 || pageSize === 0) {
            return '0 ' + of + ' ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
    };

    injectTranslateService(translate: TranslateService) {
        this.translate = translate;

        this.translate.onLangChange.subscribe(() => {
            this.translateLabels();
        });

        this.translateLabels();
    }

    translateLabels() {
        this.itemsPerPageLabel = this.translate.instant('PAGINATOR.ITEMS_PER_PAGE');
        this.nextPageLabel = this.translate.instant('PAGINATOR.NEXT_PAGE');
        this.previousPageLabel = this.translate.instant('PAGINATOR.PREVIOUS_PAGE');
    }

    getIndex(pageEvent: PageEvent, pageSize: number, index: number): number {

        const size = pageEvent && pageEvent.pageSize ? pageEvent.pageSize : pageSize;

        /* +1 because index starts at 0 */
        return (pageEvent && pageEvent.pageIndex) ? index + 1 + size * pageEvent.pageIndex : index + 1;
    }

}
