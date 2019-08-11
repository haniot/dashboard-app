import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { HeartRate } from '../models/heart-rate';
import { MeasurementType } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';

@Component({
    selector: 'heart-rate',
    templateUrl: './heart.rate.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class HeartRateComponent implements OnInit, OnChanges {
    @Input() data: Array<HeartRate>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;
    lastData: HeartRate;
    options: any;
    optionsLastData: any;
    echartsInstance: any;
    showSpinner: boolean;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.data = new Array<HeartRate>();
        this.filter_visibility = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    loadGraph() {

        const historic_text = this.translateService.instant('MEASUREMENTS.HEART-RATE.HISTORIC.TEXT');
        const historic_subtext = this.translateService.instant('MEASUREMENTS.HEART-RATE.HISTORIC.SUBTEXT');
        const frequency = this.translateService.instant('MEASUREMENTS.HEART-RATE.FREQUENCY');

        const last_date_text = this.translateService.instant('MEASUREMENTS.HEART-RATE.LAST-DATE.TEXT');
        const last_date_subtext = this.translateService.instant('MEASUREMENTS.HEART-RATE.LAST-DATE.SUBTEXT');

        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxisOptions = { data: [] };

        const seriesOptions = {
            type: 'line',
            data: []
        };

        const xAxisOptionsLastDate = { data: [] };

        const seriesOptionsLastDate = {
            type: 'line',
            data: []
        };

        this.data.forEach((heartRate) => {
            if (heartRate.dataset) {
                heartRate.dataset.forEach((elementHeartRate: { value: number, timestamp: string }) => {
                    xAxisOptions.data.push(this.datePipe.transform(elementHeartRate.timestamp, 'shortDate'));
                    seriesOptions.data.push({
                        value: elementHeartRate.value,
                        time: this.datePipe.transform(elementHeartRate.timestamp, 'mediumTime')
                    });
                });
            }
        });


        if (this.lastData) {

            if (this.lastData.dataset) {
                this.lastData.dataset.forEach((elementHeartRate: { value: number, timestamp: string }) => {

                    xAxisOptionsLastDate.data.push(this.datePipe.transform(elementHeartRate.timestamp, 'mediumTime'));

                    seriesOptionsLastDate.data.push({
                        value: elementHeartRate.value,
                        time: this.datePipe.transform(elementHeartRate.timestamp, 'mediumTime')
                    });

                });
            }
        }

        this.options = {
            title: {
                text: historic_text,
                subtext: historic_subtext
            },
            tooltip: {
                formatter: function (params) {
                    return `${frequency} : ${params[0].data.value} bpm <br> ${date}: <br> ${params[0].name} ${at} ${params[0].data.time}`
                },
                trigger: 'axis'
            },
            xAxis: xAxisOptions,
            yAxis: {
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} bpm'
                }
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: seriesOptions
        };

        this.optionsLastData = {
            title: {
                text: last_date_text,
                subtext: last_date_subtext
            },
            tooltip: {
                formatter: function (params) {
                    return `${frequency} : ${params[0].data.value} bpm <br> ${date}: <br> ${params[0].name} ${at} ${params[0].data.time}`
                },
                trigger: 'axis'
            },
            xAxis: xAxisOptionsLastDate,
            yAxis: {
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} bpm'
                }
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: seriesOptionsLastDate
        };

    }

    applyFilter(filter: { start_at: string, end_at: string, period: string }) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.heart_rate, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
            })
            .catch();
    }

    updateGraph(measurements: Array<HeartRate>): void {

        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((heartRate: HeartRate) => {
            if (heartRate.dataset) {
                heartRate.dataset.forEach((date: { value: number, timestamp: string }) => {
                    this.options.xAxis.data.push(this.datePipe.transform(date.timestamp, 'shortDate'));
                    this.options.series.data.push({
                        value: date.value,
                        time: this.datePipe.transform(date.timestamp, 'mediumTime')
                    });
                });
            }

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
