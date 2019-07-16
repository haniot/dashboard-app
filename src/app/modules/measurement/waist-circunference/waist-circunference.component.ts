import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';

import {IMeasurement, Measurement} from '../models/measurement';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'waist-circunference',
    templateUrl: './waist-circunference.component.html',
    styleUrls: ['./waist-circunference.component.scss']
})
export class WaistCircunferenceComponent implements OnInit, OnChanges {

    @Input() data: Array<IMeasurement>;
    @Input() filter_visibility: boolean;

    lastData: IMeasurement;

    options: any;

    constructor(
        private datePipe: DatePipe,
        private translateService: TranslateService
    ) {
        this.data = new Array<Measurement>();
        this.filter_visibility = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    loadGraph() {

        const circumference = this.translateService.instant('MEASUREMENTS.WAIST-CIRCUMFERENCE.CIRCUMFERENCE');
        const average = this.translateService.instant('MEASUREMENTS.AVERAGE');
        const average_value = this.translateService.instant('MEASUREMENTS.AVERAGE-VALUE');
        const date = this.translateService.instant('SHARED.DATE');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxis = {
            type: 'category',
            data: [],
            axisTick: {
                alignWithLabel: true
            }
        };

        const series = {
            type: 'bar',
            barWidth: '60%',
            color: '#00a594',
            data: [],
            markLine: {
                tooltip: {
                    trigger: 'item',
                    formatter: average_value + " : {c} cm"
                },
                lineStyle: {
                    color: 'black',
                },
                data: [
                    {type: 'average', name: average}
                ]
            }
        };


        this.data.forEach((element: Measurement) => {
            xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            series.data.push(element.value);
        });


        this.options = {
            color: ['#3398DB'],
            tooltip: {
                formatter: circumference + `: {c} cm <br> ${date}: {b}`,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: xAxis,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} cm'
                    }
                }
            ],
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
