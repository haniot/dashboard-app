import { Component, OnInit } from '@angular/core';
import * as Muuri from 'muuri';
import { EnumMeasurementType } from '../models/measurement'

@Component({
    selector: 'measurement-dashboard',
    templateUrl: './measurement.dashboard.component.html',
    styleUrls: ['./measurement.dashboard.component.scss']
})
export class MeasurementDashboardComponent implements OnInit {
    EnumMeasurementType = EnumMeasurementType;

    ngOnInit() {
        const grid1 = new Muuri('.grid-1', {
            dragEnabled: false,
            dragContainer: document.body,
            dragSort: function () {
                return [grid1]
            }
        });
    }
}
