import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateRange } from '../../pilot-study/models/range-date';

import * as $ from 'jquery';

export const FilterOptions = {
    today: 'today',
    week: '1w',
    month: '1m',
    year: '1y'
}

@Component({
    selector: 'measurement-card',
    templateUrl: './measurement-card.component.html',
    styleUrls: ['./measurement-card.component.scss']
})
export class MeasurementCardComponent implements OnInit {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() filter_visibility: boolean;
    @Output() filter_change: EventEmitter<any>;
    search: DateRange;
    currentDate: Date;
    minDate: Date;
    filterOptions = FilterOptions;
    /*mobile view*/
    filterSelected: string;

    constructor() {
        this.search = new DateRange();
        this.title = '';
        this.subtitle = '';
        this.filter_visibility = false;
        this.filter_change = new EventEmitter();
        this.currentDate = new Date();
        this.minDate = new Date((this.currentDate.getFullYear() - 1) + '/' +
            (this.currentDate.getMonth() + 1) + '/' + this.currentDate.getDate());
        this.filterSelected = 'MEASUREMENTS.MEASUREMENT-CARD.TODAY';
    }

    ngOnInit() {
    }

    filterChange(event: any): void {
        let filter: { start_at: string, end_at: string, period: string } = {
            start_at: null,
            end_at: new Date().toISOString().split('T')[0],
            period: event
        };
        if (event === 'period') {
            const start_at = this.search.begin.toISOString().split('T')[0];
            const end_at = this.search.end.toISOString().split('T')[0];
            filter = { start_at, end_at, period: null };
        } else {
            this.search = null;
        }
        this.filter_change.emit(filter);
        this.updateViewFilters(event)
    }

    updateViewFilters(filter_selected: string): void {
        switch (filter_selected) {
            case FilterOptions.today:
                this.filterSelected = 'MEASUREMENTS.MEASUREMENT-CARD.TODAY';
                break;

            case FilterOptions.week:
                this.filterSelected = 'MEASUREMENTS.MEASUREMENT-CARD.WEEK';
                break;

            case FilterOptions.month:
                this.filterSelected = 'MEASUREMENTS.MEASUREMENT-CARD.MONTH';
                break;

            case FilterOptions.year:
                this.filterSelected = 'MEASUREMENTS.MEASUREMENT-CARD.YEAR';
                break;
        }
    }


    isMobile(): boolean {
        return $(window).width() < 1080;
    }


}
