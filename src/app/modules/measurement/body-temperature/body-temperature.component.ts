import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';

import {IMeasurement, Measurement} from '../models/measurement';
import {DecimalFormatterPipe} from "../pipes/decimal-formatter.pipe";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'body-temperature',
    templateUrl: './body-temperature.component.html',
    styleUrls: ['./body-temperature.component.scss']
})
export class BodyTemperatureComponent implements OnInit, OnChanges {

    @Input() data: Array<IMeasurement>;
    @Input() filter_visibility: boolean;

    lastData: IMeasurement;

    options: any;

    constructor(
        private datePipe: DatePipe,
        private decimalPipe: DecimalFormatterPipe,
        private translateService: TranslateService
    ) {
        this.data = new Array<Measurement>();
        this.lastData = new Measurement();
        this.filter_visibility = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    loadGraph() {

        const historic_temperature = this.translateService.instant('MEASUREMENTS.BODY-TEMPERATURE.TEMPERATURE-HISTORIC');
        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');
        const temperature = this.translateService.instant('MEASUREMENTS.BODY-TEMPERATURE.TEMPERATURE');
        const date = this.translateService.instant('SHARED.DATE');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxis = {
            type: 'category',
            boundaryGap: false,
            data: []
        };

        const series = {
            name: historic_temperature,
            type: 'line',
            data: [],
            markPoint: {
                data: [
                    {type: 'max', name: max},
                    {type: 'min', name: min}
                ]
            }
        };

        this.data.forEach((element: Measurement) => {
            xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            series.data.push(this.decimalPipe.transform(element.value));
        });


        this.options = {
            tooltip: {
                formatter: temperature + `: {c} °C <br> ${date}: {b}`,
                trigger: 'axis'
            },
            xAxis: xAxis,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: series
        };


    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }
}
