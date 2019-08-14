import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { EnumMeasurementType, Measurement, SearchForPeriod } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';

@Component({
    selector: 'fat',
    templateUrl: './fat.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class FatComponent implements OnInit, OnChanges {
    @Input() data: Array<Measurement>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;
    lastData: Measurement;
    options: any;
    echartsInstance: any;
    showSpinner: boolean;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.data = new Array<Measurement>();
        this.filter_visibility = false;
        this.showSpinner = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    loadGraph() {

        const average_value = this.translateService.instant('MEASUREMENTS.AVERAGE-VALUE');
        const average = this.translateService.instant('MEASUREMENTS.AVERAGE');
        const fat = this.translateService.instant('MEASUREMENTS.FAT.FAT');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

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
            color: 'orange',
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
                            average_value + ' : {c} %'
                    }
                    ,
                    lineStyle: {
                        color: 'black'
                    }
                    ,
                    data: [
                        { type: 'average', name: average }
                    ]
                }
        };

        this.data.forEach((element: Measurement) => {
            series.data.push({
                value: element.value,
                time: this.datePipe.transform(element.timestamp, 'mediumTime')
            });
            xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
        });


        this.options = {

            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return `${fat}: ${params.data.value} %<br> ${date}: <br> ${params.name} ${at} ${params.data.time}`
                }
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

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.body_fat, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
            })
            .catch();
    }

    updateGraph(measurements: Array<Measurement>): void {

        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((element: Measurement) => {
            this.options.series.data.push({
                value: element.value,
                time: this.datePipe.transform(element.timestamp, 'mediumTime')
            });
            this.options.xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
        });

        this.echartsInstance.setOption(this.options);
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }

}
