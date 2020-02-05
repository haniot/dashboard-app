import { Component, EventEmitter, Input, Output } from '@angular/core';

import * as $ from 'jquery'
import * as moment from 'moment'

import { TimeSeriesIntervalFilter, TimeSeriesSimpleFilter } from '../../../modules/activity/models/time.series'
import { DateRange } from '../../../modules/pilot.study/models/range-date'

export const FilterOptions = {
    today: 'today',
    week: '1w',
    month: '1m',
    year: '1y',
    period: 'period'
}

@Component({
    selector: 'time-series-card',
    templateUrl: './time.series.card.component.html',
    styleUrls: ['../../../modules/activity/shared.style/shared.styles.scss', './time.series.card.component.scss']
})
export class TimeSeriesCardComponent {
    @Input() title: string;
    @Input() subtitle: string;
    @Output() filter_change: EventEmitter<any>;
    @Input() filter_visibility: boolean;
    currentDate: Date;
    search: DateRange;
    filterOptions = FilterOptions;
    /*mobile view*/
    filterSelected: string;
    minDate: Date;
    startOfDate: Date;
    endOfDate: Date;

    constructor() {
        this.currentDate = new Date();
        this.filter_change = new EventEmitter();
        this.filterSelected = 'today';
        this.filter_visibility = true;
    }

    isMobile(): boolean {
        return $(window).width() < 1080;
    }

    emitChangeFilter(): void {
        let filter: any;
        if (this.filterSelected === 'today') {
            const dateFormatted: string = moment(this.currentDate).format();
            filter = new TimeSeriesIntervalFilter()
            filter.date = dateFormatted.split('T')[0];
            filter.interval = '15m';
        } else {
            filter = new TimeSeriesSimpleFilter()
            const startFormatted: string = moment(this.startOfDate).format();
            filter.start_date = startFormatted.split('T')[0];
            const endFormatted: string = moment(this.endOfDate).format();
            filter.end_date = endFormatted.split('T')[0];
        }
        this.filter_change.emit({ type: this.filterSelected, filter });
    }

    filterChange(event: any): void {
        this.filterSelected = event;
        switch (this.filterSelected) {
            case '1m':
                this.startOfDate = moment().startOf('month').toDate();
                this.endOfDate = moment().endOf('month').toDate();
                break;

            case '1y':
                this.startOfDate = moment().startOf('year').toDate();
                this.endOfDate = moment().endOf('year').toDate();
                break;

            case 'period':
                this.startOfDate = moment(this.search.begin.toISOString().split('T')[0]).toDate();
                this.endOfDate = moment(this.search.end.toISOString().split('T')[0]).toDate();
                break;

            default:
                this.startOfDate = moment().startOf('week').toDate();
                this.endOfDate = moment().endOf('week').toDate();
                break;
        }
        this.emitChangeFilter();
    }

    previous(): void {
        switch (this.filterSelected) {
            case 'today':
                this.currentDate = new Date(this.currentDate.getTime() - (24 * 60 * 60 * 1000));
                break;

            case '1w':
                this.startOfDate = moment(this.startOfDate).subtract(1, 'w').toDate();
                this.endOfDate = moment(this.endOfDate).subtract(1, 'w').toDate();
                break;

            case '1m':
                this.startOfDate = moment(this.startOfDate).subtract(1, 'M').toDate();
                this.endOfDate = moment(this.endOfDate).subtract(1, 'M').toDate();
                break;

            case '1y':
                this.startOfDate = moment(this.startOfDate).subtract(1, 'y').toDate();
                this.endOfDate = moment(this.endOfDate).subtract(1, 'y').toDate();
                break;
        }
        this.emitChangeFilter();
    }

    next(): void {
        switch (this.filterSelected) {
            case 'today':
                if (!this.isToday(this.currentDate)) {
                    this.currentDate = new Date(this.currentDate.getTime() + (24 * 60 * 60 * 1000));
                }
                break;

            case '1w':
                if (this.endOfDate.getTime() < this.currentDate.getTime()) {
                    this.startOfDate = moment(this.startOfDate).add(1, 'w').toDate();
                    this.endOfDate = moment(this.endOfDate).add(1, 'w').toDate();
                }
                break;

            case '1m':
                if (this.endOfDate.getTime() < this.currentDate.getTime()) {
                    this.startOfDate = moment(this.startOfDate).add(1, 'M').toDate();
                    this.endOfDate = moment(this.endOfDate).add(1, 'M').toDate();
                }
                break;

            case '1y':
                if (this.endOfDate.getTime() < this.currentDate.getTime()) {
                    this.startOfDate = moment(this.startOfDate).add(1, 'y').toDate();
                    this.endOfDate = moment(this.endOfDate).add(1, 'y').toDate();
                }
                break;
        }
        this.emitChangeFilter();
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    }


}
