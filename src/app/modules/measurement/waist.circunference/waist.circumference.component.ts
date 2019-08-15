import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { EnumMeasurementType, Measurement, SearchForPeriod } from '../models/measurement';
import { TranslateService } from '@ngx-translate/core';
import { Weight } from '../models/weight';
import { MeasurementService } from '../services/measurement.service';

@Component({
    selector: 'waist-circunference',
    templateUrl: './waist.circumference.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class WaistCircumferenceComponent implements OnInit, OnChanges {
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

        const circumference = this.translateService.instant('MEASUREMENTS.WAIST-CIRCUMFERENCE.CIRCUMFERENCE');
        const average = this.translateService.instant('MEASUREMENTS.AVERAGE');
        const average_value = this.translateService.instant('MEASUREMENTS.AVERAGE-VALUE');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

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
                    formatter: average_value + ' : {c} cm'
                },
                lineStyle: {
                    color: 'black'
                },
                data: [
                    { type: 'average', name: average }
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
            color: ['#3398DB'],
            tooltip: {
                formatter: function (params) {
                    return `${circumference}: ${params[0].data.value} cm <br> ${date}: <br> ${params[0].name} ${at} ${params[0].data.time}`
                },
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

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.waist_circumference, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
            })
            .catch();
    }

    updateGraph(measurements: Array<any>): void {
        // clean
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
