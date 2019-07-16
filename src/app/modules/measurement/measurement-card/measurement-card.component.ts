import {Component, Input, OnInit} from '@angular/core';
import {DateRange} from "../../pilot-study/models/range-date";

@Component({
    selector: 'measurement-card',
    templateUrl: './measurement-card.component.html',
    styleUrls: ['./measurement-card.component.scss']
})
export class MeasurementCardComponent implements OnInit {

    @Input() title: string;
    @Input() subtitle: string;
    @Input() filter_visibility: boolean;

    search: DateRange;

    constructor() {
        this.search = new DateRange();
        this.title = "";
        this.subtitle = "";
        this.filter_visibility = false;
    }

    ngOnInit() {
    }

    searchOnSubmit() {

    }

}
