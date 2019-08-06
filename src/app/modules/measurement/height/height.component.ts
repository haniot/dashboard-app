import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { Measurement, MeasurementType } from '../models/measurement';
import { Weight } from '../models/weight';
import { MeasurementService } from '../services/measurement.service';

@Component({
    selector: 'height',
    templateUrl: './height.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class HeightComponent implements OnInit, OnChanges {
    @Input() data: Array<Measurement>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;
    lastData: Measurement;
    options: any;
    showSpinner: boolean;
    echartsInstance: any;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.data = new Array<Measurement>();
        this.filter_visibility = false;
        this.patientId = '';
        this.showSpinner = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    loadGraph() {

        const height = this.translateService.instant('MEASUREMENTS.HEIGHT.HEIGHT');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');
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
            name: height,
            type: 'line',
            step: 'start',
            data: [],
            color: '#3F51B5',
            markPoint: {
                label: {
                    fontSize: 10,
                    formatter: function (params) {
                        if (params.data.type === 'max') {
                            return max;
                        }
                        if (params.data.type === 'min') {
                            return min;
                        }
                    }
                },
                data: [
                    { type: 'max' },
                    { type: 'min' }
                ]
            }
        };

        this.data.forEach((element: Measurement) => {
            xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            series.data.push({
                value: element.value,
                time: this.datePipe.transform(element.timestamp, 'mediumTime')
            });
        });


        this.options = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return `${height}: ${params.data.value} cm <br> ${date}: <br> ${params.name} ${at} ${params.data.time}`;
                }
            },
            xAxis: xAxis,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} cm'
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

    applyFilter(filter: { start_at: string, end_at: string, period: string }) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.height, null, null, filter)
            .then((measurements: Array<any>) => {
                this.data = measurements;
                this.showSpinner = false;
                this.updateGraph(measurements);
            })
            .catch();
    }

    updateGraph(measurements: Array<any>): void {
        // clean weightGraph
        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((element: Weight) => {
            this.options.xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            this.options.series.data.push({
                value: element.value,
                time: this.datePipe.transform(element.timestamp, 'mediumTime')
            });
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
