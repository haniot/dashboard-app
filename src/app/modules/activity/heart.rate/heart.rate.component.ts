import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr'

import { MeasurementService } from '../../measurement/services/measurement.service';
import { HeartRateItem, HeartRateZone, TimeSeries, TimeSeriesItem, TimeSeriesType } from '../models/time.series'
import { TimeSeriesService } from '../services/time.series.service'
import { MillisecondPipe } from '../pipes/millisecond.pipe'

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
    optionsIntraday: any;
    optionsInstance: any;
    intradayInstance: any;
    Math = Math;
    zones: HeartRateZone;

    constructor(
        private datePipe: DatePipe,
        private millisecondPipe: MillisecondPipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private toastService: ToastrService,
        private timeSeriesService: TimeSeriesService
    ) {
        this.data = new TimeSeries();
        this.zones = new HeartRateZone()
        this.filterVisibility = false;
        this.patientId = '';
        this.showSpinner = false;
        this.listIsEmpty = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    onOptionsChartInit(instance) {
        this.optionsInstance = instance;
    }

    onIntradayChartInit(instance) {
        this.intradayInstance = instance;
    }

    loadGraph() {

        const frequency = this.translateService.instant('TIME-SERIES.HEART-RATE.FREQUENCY');

        const hour = this.translateService.instant('SHARED.HOUR');
        const at = this.translateService.instant('SHARED.AT');

        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');

        const low = this.translateService.instant('TIME-SERIES.HEART-RATE.LOW');
        const normal = this.translateService.instant('TIME-SERIES.HEART-RATE.NORMAL');
        const high = this.translateService.instant('TIME-SERIES.HEART-RATE.HIGH');
        const upperLimit = this.translateService.instant('SHARED.UPPER-LIMIT');
        const classification = this.translateService.instant('SHARED.CLASSIFICATION');

        const name_fat_burn = this.translateService.instant('TIME-SERIES.HEART-RATE.FAT-BURN');
        const name_cardio = this.translateService.instant('TIME-SERIES.HEART-RATE.CARDIO');
        const name_peak = this.translateService.instant('TIME-SERIES.HEART-RATE.PEAK');
        const name_out_of_range = this.translateService.instant('TIME-SERIES.HEART-RATE.OUT-OF-RANGE');

        const xAxisOptions = [{ type: 'category', boundaryGap: false, data: [] }];

        const seriesOptions = [
            { name: name_out_of_range, stack: 'stack', type: 'bar', data: [], barMaxWidth: '20%', color: '#999' },
            { name: name_fat_burn, stack: 'stack', type: 'bar', data: [], barMaxWidth: '30%', color: '#FFC023' },
            { name: name_cardio, stack: 'stack', type: 'bar', data: [], barMaxWidth: '30%', color: '#FD8518' },
            { name: name_peak, stack: 'stack', type: 'bar', data: [], barMaxWidth: '30%', color: '#E60013' }
        ];

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
                    xAxisOptionsLastDate.data.push(element.time);
                    seriesOptionsLastDate.data.push({
                        value: element.value,
                        time: element.time
                    });
                });
            } else {
                this.data.data_set.forEach((element: HeartRateItem) => {
                    const { zones: { fat_burn, cardio, out_of_range, peak } } = element;
                    if (xAxisOptions[0].data.length === 0) {
                        xAxisOptions[0].data.push('');
                        seriesOptions[0].data.push({ value: 0, formatted: '', time: '' });
                        seriesOptions[1].data.push({ value: 0, formatted: '', time: '' });
                        seriesOptions[2].data.push({ value: 0, formatted: '', time: '' });
                        seriesOptions[3].data.push({ value: 0, formatted: '', time: '' });
                    }
                    xAxisOptions[0].data.push(this.datePipe.transform(element.date, 'shortDate'));
                    seriesOptions[0].data.push({
                        value: out_of_range.duration,
                        formatted: this.millisecondPipe.transform(out_of_range.duration),
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });
                    seriesOptions[1].data.push({
                        value: fat_burn.duration,
                        formatted: this.millisecondPipe.transform(fat_burn.duration),
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });
                    seriesOptions[2].data.push({
                        value: cardio.duration,
                        formatted: this.millisecondPipe.transform(cardio.duration),
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });
                    seriesOptions[3].data.push({
                        value: peak.duration,
                        formatted: this.millisecondPipe.transform(peak.duration),
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });
                });
                xAxisOptions[0].data.push('');
                seriesOptions[0].data.push({ value: 0, formatted: '', time: '' });
                seriesOptions[1].data.push({ value: 0, formatted: '', time: '' });
                seriesOptions[2].data.push({ value: 0, formatted: '', time: '' });
                seriesOptions[3].data.push({ value: 0, formatted: '', time: '' });
            }
        }

        this.options = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    return `${params[0].axisValue}<br>` +
                        `${params[0].marker} ${params[0].seriesName} - ${params[0].data.formatted}<br>` +
                        `${params[1].marker} ${params[1].seriesName} - ${params[1].data.formatted}<br>` +
                        `${params[2].marker} ${params[2].seriesName} - ${params[2].data.formatted}<br>` +
                        `${params[3].marker} ${params[3].seriesName} - ${params[3].data.formatted}<br>`;
                }
            },
            legend: {
                data: [name_fat_burn, name_cardio, name_peak, name_out_of_range]
            },
            xAxis: xAxisOptions,
            yAxis: [
                { type: 'value' }
            ],
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: seriesOptions
        };

        this.optionsIntraday = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    params = params[0];
                    if (params.data.type === 'max' || params.data.type === 'min') {
                        const t = seriesOptionsLastDate.data.find(currenHeartRate => {
                            return currenHeartRate.value === params.value;
                        });
                        if (t) {
                            return `${frequency} : ${t.value} bpm <br> ${hour}: <br> ${t.date} ${at} ${t.time}`
                        }

                    }
                    const { value, date, time } = params.data
                    return `${params.marker}<br>${frequency} : ${value} bpm <br> ${hour}: ${time}`
                }
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
                    gt: this.zones.fat_burn.min,
                    lte: this.zones.fat_burn.max,
                    label: name_fat_burn,
                    color: '#FFC023'
                }, {
                    gt: this.zones.cardio.min,
                    lte: this.zones.cardio.max,
                    label: name_cardio,
                    color: '#FD8518'
                }, {
                    gt: this.zones.peak.min,
                    lte: this.zones.peak.max,
                    label: name_peak,
                    color: '#E60013'
                }, {
                    gt: this.zones.out_of_range.min,
                    lte: this.zones.out_of_range.max,
                    label: name_out_of_range,
                    color: '#999'
                }
                ]
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
            .then((heartRate: TimeSeries | any) => {
                if (heartRate && heartRate.data_set) {
                    this.data = heartRate;
                    this.zones = heartRate.summary.zones ? heartRate.summary.zones : new HeartRateZone();
                    this.loadGraph();
                }
                if (this.intraday) {
                    this.listIsEmpty = !(this.data) || (!this.data.summary) ||
                        (!this.data.summary.min && !this.data.summary.max && !this.data.summary.average);
                } else {
                    this.listIsEmpty = !(this.data) || (!this.data.summary) ||
                        (!this.data.summary.fat_burn_total && !this.data.summary.cardio_total &&
                            !this.data.summary.peak_total && !this.data.summary.out_of_range_total);
                }
                this.showSpinner = false;
            })
            .catch((err) => {
                this.data = new TimeSeries();
                this.listIsEmpty = true;
                this.showSpinner = false;
            });
    }

    updateGraph(measurements: Array<TimeSeries>): void {

        this.optionsIntraday.xAxis.data = [];
        this.optionsIntraday.series.data = [];

        measurements.forEach((heartRate: TimeSeries) => {
            if (heartRate.data_set) {
                heartRate.data_set.forEach((element: TimeSeriesItem) => {
                    this.optionsIntraday.xAxis.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    this.optionsIntraday.series.data.push({
                        value: element.value,
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });
                });
            }

        });

        this.intradayInstance.setOption(this.optionsIntraday);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && changes.data.currentValue !== changes.data.previousValue) {
            this.loadGraph();
        }
    }

}
