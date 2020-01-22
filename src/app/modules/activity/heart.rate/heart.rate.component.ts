import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr'

import { MeasurementService } from '../../measurement/services/measurement.service';
import { TimeSeries, TimeSeriesItem, TimeSeriesType } from '../models/time.series'
import { TimeSeriesService } from '../services/time.series.service'

@Component({
    selector: 'heart-rate',
    templateUrl: './heart.rate.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class HeartRateComponent implements OnInit, OnChanges {
    @Input() data: TimeSeries | any;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() showSpinner: boolean;
    @Input() intraday: boolean;
    @Input() listIsEmpty: boolean;
    options: any;
    optionsLastData: any;
    echartsInstance: any;
    Math = Math;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private toastService: ToastrService,
        private timeSeriesService: TimeSeriesService
    ) {
        this.data = new TimeSeries();
        this.filterVisibility = false;
        this.patientId = '';
        this.showSpinner = false;
        this.listIsEmpty = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    loadGraph() {
        const historic_text = this.translateService.instant('TIME-SERIES.HEART-RATE.HISTORIC.TEXT');
        const historic_subtext = this.translateService.instant('TIME-SERIES.HEART-RATE.HISTORIC.SUBTEXT');
        const frequency = this.translateService.instant('TIME-SERIES.HEART-RATE.FREQUENCY');

        const dateAndHour = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');

        const low = this.translateService.instant('TIME-SERIES.HEART-RATE.LOW');
        const normal = this.translateService.instant('TIME-SERIES.HEART-RATE.NORMAL');
        const high = this.translateService.instant('TIME-SERIES.HEART-RATE.HIGH');
        const upperLimit = this.translateService.instant('SHARED.UPPER-LIMIT');
        const classification = this.translateService.instant('SHARED.CLASSIFICATION');

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
                silent: false,
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        try {
                            const { data: { label: { formatter } }, value } = params
                            return `${upperLimit}: ${value}bpm<br>${classification}: ${formatter}`;
                        } catch (e) {
                        }
                    }
                },
                data: [{
                    label: {
                        formatter: low
                    },
                    yAxis: 50
                }, {
                    label: {
                        formatter: normal
                    },
                    yAxis: 100
                }, {
                    label: {
                        formatter: high
                    },
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

        if (this.data && this.data.data_set) {
            if (this.intraday) {
                this.data.data_set.forEach((element: { time: string, value: number }) => {
                    xAxisOptions.data.push(element.time);
                    seriesOptions.data.push({
                        value: element.value,
                        time: element.time
                    });
                });
            } else {
                this.data.data_set.forEach((element: TimeSeriesItem) => {
                    xAxisOptions.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    seriesOptions.data.push({
                        value: element.value,
                        time: this.datePipe.transform(element.date, 'mediumTime')
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
                    const { value, date, time } = params[0].data
                    return `${frequency} : ${value} bpm <br> ${dateAndHour}: <br> ${date} ${at} ${time}`
                },
                trigger: 'item'
            },
            xAxis: xAxisOptions,
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} bpm'
                },
                min: 0,
                max: 200
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: seriesOptionsLastDate
        };

        this.optionsLastData = {
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
                },
                min: 0,
                max: 200
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
                    label: low,
                    color: '#236399'
                }, {
                    gt: 50,
                    lte: 100,
                    label: normal,
                    color: '#ffde33'
                }, {
                    gt: 100,
                    label: high,
                    color: '#7e0023'
                }],
                outOfRange: {
                    color: '#999'
                }
            },
            series: seriesOptionsLastDate
        };

    }

    applyFilter(event: any) {
        this.data = undefined;
        this.showSpinner = true;
        this.intraday = event.type === 'today';
        let service = 'getWithResource';
        if (event.type === 'today') {
            service = 'getWithResourceAndInterval';
        }
        this.timeSeriesService[service](this.patientId, TimeSeriesType.heart_rate, event.filter)
            .then((heartRate: TimeSeries) => {
                if (heartRate && heartRate.data_set) {
                    this.data = heartRate;
                    this.loadGraph();
                }
                this.listIsEmpty = !(this.data) || (!this.data.summary || (!this.data.summary._fat_burn_total &&
                    !this.data.summary._cardio_total &&
                    !this.data.summary._peak_total &&
                    !this.data.summary._out_of_range_total));
                this.showSpinner = false;
            })
            .catch(() => {
                this.data = new TimeSeries();
                this.listIsEmpty = true;
                this.showSpinner = false;
            });
    }

    updateGraph(measurements: Array<TimeSeries>): void {

        this.optionsLastData.xAxis.data = [];
        this.optionsLastData.series.data = [];

        measurements.forEach((heartRate: TimeSeries) => {
            if (heartRate.data_set) {
                heartRate.data_set.forEach((element: TimeSeriesItem) => {
                    this.optionsLastData.xAxis.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    this.optionsLastData.series.data.push({
                        value: element.value,
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });
                });
            }

        });

        this.echartsInstance.setOption(this.optionsLastData);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && changes.data.currentValue !== changes.data.previousValue) {
            this.loadGraph();
        }
    }

}