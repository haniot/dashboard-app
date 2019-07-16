import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {IMeasurement, Measurement} from '../models/measurement';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'fat',
    templateUrl: './fat.component.html',
    styleUrls: ['./fat.component.scss']
})
export class FatComponent implements OnInit, OnChanges {

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

        const average_value = this.translateService.instant('MEASUREMENTS.AVERAGE-VALUE');
        const average = this.translateService.instant('MEASUREMENTS.AVERAGE');
        const fat = this.translateService.instant('MEASUREMENTS.FAT.FAT');
        const date = this.translateService.instant('SHARED.DATE');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxis = {
            type: 'category',
            data: []
        };

        const series = {
            type: 'bar',
            data: [],
            color: '#00a594',
            label: {
                normal: {
                    show: true,
                    position: 'outside',
                    offset: [0, -20],
                    formatter: function (params) {
                        return `${params.value} % `;
                    },
                    textStyle: {
                        fontSize: 18,
                        fontFamily: 'Arial'
                    }
                }
            },
            markLine:
                {
                    tooltip: {
                        trigger: 'item',
                        formatter:
                            average_value + " : {c} %"
                    }
                    ,
                    lineStyle: {
                        color: 'black',
                    }
                    ,
                    data: [
                        {type: 'average', name: average}
                    ]
                }
        };

        this.data.forEach((element: Measurement) => {
            series.data.push(element.value);

            const find = xAxis.data.find((ele) => {
                return ele === this.datePipe.transform(element.timestamp, "shortDate");
            });

            if (!find) {
                xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            }

        });


        this.options = {

            tooltip: {
                trigger: 'item',
                formatter: fat + `: {c} %<br> ${date}: {b}`
            },
            xAxis: xAxis,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} %'
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
