import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateRange} from "../../pilot-study/models/range-date";
import {SatDatepickerModule} from "saturn-datepicker";

export const FilterOptions = {
    today: "today",
    week: "1w",
    month: "1m",
    year: "1y"
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

    state_today: string;
    state_week: string;
    state_month: string;
    state_year: string;

    search: DateRange;

    currentDate: Date;
    minDate: Date;

    filterOptions = FilterOptions;

    constructor() {
        this.search = new DateRange();
        this.title = "";
        this.subtitle = "";
        this.filter_visibility = false;
        this.filter_change = new EventEmitter();
        this.state_today = "btn-actived";
        this.state_week = "btn-disabled";
        this.state_month = "btn-disabled";
        this.state_year = "btn-disabled";
        this.currentDate = new Date();
        this.minDate = new Date((this.currentDate.getFullYear() - 1) + '/' +
            (this.currentDate.getMonth() + 1) + '/' + this.currentDate.getDate());
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
            filter = {start_at, end_at, period: null};
        }
        this.filter_change.emit(filter);
        this.updateViewFilters(event);
    }

    updateViewFilters(filter_selected: string): void {
        switch (filter_selected) {
            case this.filterOptions.today:
                this.state_today = "btn-actived";
                this.state_week = "btn-disabled";
                this.state_month = "btn-disabled";
                this.state_year = "btn-disabled";
                this.search = null;
                break;
            case this.filterOptions.week:
                this.state_week = "btn-actived";
                this.state_today = "btn-disabled";
                this.state_month = "btn-disabled";
                this.state_year = "btn-disabled";
                break;
            case this.filterOptions.month:
                this.state_month = "btn-actived";
                this.state_today = "btn-disabled";
                this.state_week = "btn-disabled";
                this.state_year = "btn-disabled";
                break;
            case this.filterOptions.year:
                this.state_year = "btn-actived";
                this.state_today = "btn-disabled";
                this.state_week = "btn-disabled";
                this.state_month = "btn-disabled";
                break;
            default:
                this.state_today = "btn-disabled";
                this.state_week = "btn-disabled";
                this.state_month = "btn-disabled";
                this.state_year = "btn-disabled";
                break;
        }
    }


}
