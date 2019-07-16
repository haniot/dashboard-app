import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateRange} from "../../pilot-study/models/range-date";
import {SatDatepickerModule} from "saturn-datepicker";

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
    }

    ngOnInit() {
    }

    filterChange(event: string): void {
        if (event === 'period') {
            this.filter_change.emit(this.search);
        } else {
            this.filter_change.emit(event);
        }
        this.updateViewFilters(event);
    }

    updateViewFilters(filter_selected: string): void {
        switch (filter_selected) {
            case 'today':
                this.state_today = "btn-actived";
                this.state_week = "btn-disabled";
                this.state_month = "btn-disabled";
                this.state_year = "btn-disabled";
                this.search = null;
                break;
            case '1w':
                this.state_week = "btn-actived";
                this.state_today = "btn-disabled";
                this.state_month = "btn-disabled";
                this.state_year = "btn-disabled";
                break;
            case '1m':
                this.state_month = "btn-actived";
                this.state_today = "btn-disabled";
                this.state_week = "btn-disabled";
                this.state_year = "btn-disabled";
                break;
            case '1y':
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
