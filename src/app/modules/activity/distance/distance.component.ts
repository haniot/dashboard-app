import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { TimeSeries, TimeSeriesItem, TimeSeriesType } from '../models/time.series';
import { TimeSeriesService } from '../services/time.series.service'
import { DistancePipe } from '../pipes/distance.pipe'

@Component({
    selector: 'distance',
    templateUrl: './distance.component.html',
    styleUrls: ['../../measurement/shared.style/shared.styles.scss']
})
export class DistanceComponent implements OnInit, OnChanges {
    @Input() data: TimeSeries | any;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() showSpinner: boolean;
    @Input() intraday: boolean;
    @Input() listIsEmpty: boolean;
    options: any;
    echartsInstance: any;

    constructor(
        private datePipe: DatePipe,
        private translateService: TranslateService,
        private  distancePipe: DistancePipe,
        private decimalPipe: DecimalPipe,
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

    applyFilter(event: any): void {
        this.data = undefined;
        this.showSpinner = true;
        this.intraday = event.type === 'today';
        let service = 'getWithResource';
        if (event.type === 'today') {
            service = 'getWithResourceAndInterval';
        }
        this.timeSeriesService[service](this.patientId, TimeSeriesType.distance, event.filter)
            .then((distance: TimeSeries) => {
                if (distance && distance.data_set) {
                    this.data = distance;
                    this.loadGraph();
                }
                this.listIsEmpty = !(this.data) || (!this.data.summary || !this.data.summary.total);
                this.showSpinner = false;
            })
            .catch(() => {
                this.data = new TimeSeries();
                this.listIsEmpty = true;
                this.showSpinner = false;
            });
    }

    loadGraph() {

        const xAxisOptions = {
            show: !this.intraday,
            data: [],
            silent: false,
            splitLine: {
                show: false
            }
        };

        const seriesOptions = {
            type: 'bar',
            color: '#ffc04d',
            data: [],
            barMaxWidth: '50px',
            animationDelay: function (idx) {
                return idx * 10;
            }
        };

        if (this.data && this.data.data_set) {
            if (this.intraday) {
                this.data.data_set.forEach((element: { time: string, value: string }) => {
                    if (element.value) {
                        xAxisOptions.data.push(element.time);
                        seriesOptions.data.push({
                            value: element.value,
                            formatted: this.decimalPipe.transform(element.value, '1.1-3') + 'm',
                            time: element.time
                        });
                    }
                });
            } else {
                this.data.data_set.forEach((element: TimeSeriesItem) => {
                    if (element.value) {
                        xAxisOptions.data.push(this.datePipe.transform(element.date, 'shortDate'));
                        seriesOptions.data.push({
                            value: element.value,
                            formatted: this.distancePipe.transform(element.value),
                            time: this.datePipe.transform(element.date, 'mediumTime')
                        });
                    }
                });
            }
        }

        const grid = this.intraday ? [{ x: '5%', y: '7%', width: '100%', height: '90%' }] :
            [{ x: '5%', y: '5%', width: '100%', height: '88%' }]

        this.options = {
            legend: {
                data: ['bar', 'bar2'],
                align: 'left'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    const { changingThisBreaksApplicationSecurity } = params[0].data.formatted;
                    if (changingThisBreaksApplicationSecurity) {
                        return `${params[0].name}<br>` +
                            `${params[0].marker}` +
                            `${params[0].data.value > 1 ? changingThisBreaksApplicationSecurity : params[0].data.value + 'm'}`;
                    }
                    return `${params[0].name}<br>` +
                        `${params[0].marker} ${params[0].data.formatted}`;
                }
            },
            grid,
            dataZoom: {
                show: true,
                type: 'inside'
            },
            xAxis: xAxisOptions,
            yAxis: {},
            series: seriesOptions
        };

    }

    updateGraph(measurements: Array<TimeSeries>): void {

        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((distance: TimeSeries) => {
            if (distance.data_set) {
                distance.data_set.forEach((element: TimeSeriesItem) => {
                    this.options.xAxis.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    this.options.series.data.push({
                        value: element.value,
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });
                });
            }

        });

        this.echartsInstance.setOption(this.options);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && changes.data.currentValue !== changes.data.previousValue) {
            this.loadGraph();
        }
    }

}
