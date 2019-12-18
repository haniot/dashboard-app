import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { MeasurementService } from '../../measurement/services/measurement.service';
import { SearchForPeriod } from '../../measurement/models/measurement'
import { ToastrService } from 'ngx-toastr'
import { TimeSeries, TimeSeriesItem, TimeSeriesType } from '../models/time.series'

@Component({
    selector: 'heart-rate',
    templateUrl: './heart.rate.component.html',
    styleUrls: ['../../measurement/shared.style/shared.styles.scss']
})
export class HeartRateComponent implements OnInit, OnChanges {
    @Input() data: Array<TimeSeries>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    lastData: TimeSeries;
    options: any;
    optionsLastData: any;
    echartsInstance: any;
    listIsEmpty: boolean;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private toastService: ToastrService
    ) {
        this.data = new Array<TimeSeries>();
        this.filterVisibility = false;
        this.patientId = '';
        this.showSpinner = false;
        this.filterChange = new EventEmitter();
        this.listIsEmpty = false;
        this.lastData = new TimeSeries();
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

        this.data.forEach((heartRate) => {
            if (heartRate.data_set) {
                heartRate.data_set.forEach((element: TimeSeriesItem) => {
                    xAxisOptions.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    seriesOptions.data.push({
                        value: element.value,
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });
                });
            }
        });


        if (this.lastData) {
            if (this.lastData.data_set) {
                this.lastData.data_set.forEach((elementHeartRate: TimeSeriesItem) => {

                    xAxisOptionsLastDate.data.push(this.datePipe.transform(elementHeartRate.date, 'mediumTime'));

                    seriesOptionsLastDate.data.push({
                        value: elementHeartRate.value,
                        time: this.datePipe.transform(elementHeartRate.date, 'mediumTime'),
                        date: this.datePipe.transform(elementHeartRate.date, 'shortDate')
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

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.data = [];
        this.measurementService
            .getAllByUserAndType(this.patientId, TimeSeriesType.heart_rate, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
                this.filterChange.emit(this.data);
            })
            .catch(() => {
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
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }

}
