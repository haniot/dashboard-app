import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { HeartRate } from '../models/heart-rate';
import { MeasurementService } from '../services/measurement.service';
import { EnumMeasurementType } from '../models/measurement'

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

        const dateAndHour = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');

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
            data: [],
            color: '#7F7F7F',
            lineStyle: {
                normal: {
                    width: 4
                }
            },
            markLine: {
                silent: true,
                data: [{
                    yAxis: 50
                }, {
                    yAxis: 100
                }, {
                    yAxis: 200
                }]
            },
            markPoint: {
                label: {
                    color: '#FFFFFF',
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
                        time: this.datePipe.transform(elementHeartRate.timestamp, 'mediumTime'),
                        date: this.datePipe.transform(elementHeartRate.timestamp, 'shortDate')
                    });

                });
            }
        }

        const values = seriesOptionsLastDate.data.map(element => {
            return element.value
        })

        const maxValue = values.reduce((first, second) => {
            return Math.max(first, second);
        })

        if (seriesOptionsLastDate.markLine.data[2]) {
            seriesOptionsLastDate.markLine.data[2].yAxis = maxValue;
        }

        this.options = {
            title: {
                text: historic_text,
                subtext: historic_subtext
            },
            tooltip: {
                formatter: function (params) {
                    console.log(params)
                    const { value, date, time } = params[0].data
                    return `${frequency} : ${value} bpm <br> ${dateAndHour}: <br> ${date} ${at} ${time}`
                },
                trigger: 'item'
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
            // title: {
            //     text: last_date_text,
            //     subtext: last_date_subtext
            // },
            tooltip: {
                formatter: function (params) {
                    if (params.data.type === 'max' || params.data.type === 'min') {
                        const t = seriesOptionsLastDate.data.find(currenHeartRate => {
                            return currenHeartRate.value === params.value;
                        });
                        if (t) {
                            return `${frequency} : ${t.value} bpm <br> ${dateAndHour}: <br> ${t.date} ${at} ${t.time}`
                        }

                    }
                    const { value, date, time } = params.data
                    return `${frequency} : ${value} bpm <br> ${dateAndHour}: <br> ${date} ${at} ${time}`
                },
                trigger: 'item'
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
            visualMap: {
                orient: 'horizontal',
                top: 20,
                right: 0,
                pieces: [{
                    gt: 0,
                    lte: 50,
                    label: 'Baixa',
                    color: '#236399'
                }, {
                    gt: 50,
                    lte: 100,
                    label: 'Normal',
                    color: '#ffde33'
                }, {
                    gt: 100,
                    label: 'Alta',
                    color: '#7e0023'
                }],
                outOfRange: {
                    color: '#999'
                }
            },
            series: seriesOptionsLastDate
        };

    }

    applyFilter(filter: { start_at: string, end_at: string, period: string }) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.heart_rate, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
            })
            .catch();
    }

    updateGraph(measurements: Array<HeartRate>): void {

        this.optionsLastData.xAxis.data = [];
        this.optionsLastData.series.data = [];

        measurements.forEach((heartRate: HeartRate) => {
            if (heartRate.dataset) {
                heartRate.dataset.forEach((date: { value: number, timestamp: string }) => {
                    this.optionsLastData.xAxis.data.push(this.datePipe.transform(date.timestamp, 'shortDate'));
                    this.optionsLastData.series.data.push({
                        value: date.value,
                        time: this.datePipe.transform(date.timestamp, 'mediumTime')
                    });
                });
            }

        });

        this.echartsInstance.setOption(this.optionsLastData);
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }

}
