import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';
import * as moment from 'moment';

import { defaultIntervalIntraday, TimeSeries, TimeSeriesItem, TimeSeriesType } from '../models/time.series';
import { TimeSeriesService } from '../services/time.series.service'
import { DurationInputArg2 } from 'moment'

@Component({
    selector: 'calories',
    templateUrl: './calories.component.html',
    styleUrls: ['../../measurement/shared.style/shared.styles.scss']
})
export class CaloriesComponent implements OnInit, OnChanges {
    @Input() data: TimeSeries | any;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() showSpinner: boolean;
    @Input() intraday: boolean;
    @Input() listIsEmpty: boolean;
    @Input() onlyGraph: boolean;
    @Input() filter: any;
    options: any;
    echartsInstance: any;
    Math = Math;

    constructor(
        private datePipe: DatePipe,
        private numberPipe: DecimalPipe,
        private translateService: TranslateService,
        private timeSeriesService: TimeSeriesService
    ) {
        this.data = new TimeSeries();
        this.filterVisibility = false;
        this.patientId = '';
        this.showSpinner = false;
        this.listIsEmpty = false;
    }

    ngOnInit(): void {
        this.completeDataSet();
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
        this.timeSeriesService[service](this.patientId, TimeSeriesType.calories, event.filter)
            .then((calories: TimeSeries) => {
                if (calories && calories.data_set) {
                    this.data = calories;
                    this.completeDataSet();
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

    completeDataSet(): void {
        if (this.intraday && this.data && this.data.data_set) {
            const completeDataSet = new TimeSeries().completeDataSet();
            this.data.data_set = this.data.data_set.concat(completeDataSet.slice(this.data.data_set.length));
        }
        this.loadGraph();
    }

    loadGraph() {

        const calories = this.translateService.instant('TIME-SERIES.CALORIES.CALORIES');

        if (this.intraday && this.data && this.data.data_set) {
            this.data.data_set.push({ time: '23:59:59'});
        }

        const xAxisLenght = this.data && this.data.data_set ? this.data.data_set.length : 0;

        const xAxisOptions = this.intraday ? {
                data: [],
                axisLabel: {
                    formatter: (value, index) => {
                        return (index === 0) || (index === xAxisLenght - 1) ? value : '';
                    },
                    showMinLabel: true,
                    showMaxLabel: true
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                boundaryGap: false
            }
            :
            {
                show: true,
                data: [],
                axisLabel: {
                    showMinLabel: true,
                    showMaxLabel: true
                },
                silent: false,
                splitLine: {
                    show: false
                }
            }
        ;

        const seriesOptions = this.intraday ?
            {
                type: 'line',
                step: true,
                itemStyle: {
                    color: '#FBA53E'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#FFF2F2'
                    }, {
                        offset: 1,
                        color: 'rgba(251,165,62,0.1)'
                    }])
                },
                data: []
            }
            : {
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
                this.data.data_set.forEach((element: { time: string, value: number }) => {

                    xAxisOptions.data.push(element.time);
                    seriesOptions.data.push({
                        value: Math.floor(element.value),
                        formatted: this.numberPipe.transform(element.value, '1.0-0'),
                        time: element.time
                    });

                });
            } else {
                this.data.data_set.forEach((element: TimeSeriesItem) => {

                    xAxisOptions.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    seriesOptions.data.push({
                        value: Math.floor(element.value),
                        formatted: this.numberPipe.transform(element.value, '1.0-0'),
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });

                });
            }
        }

        const grid = [{ x: '5%', y: '7%', width: '92%', height: '88%' }];
        const yAxisMargin = this.onlyGraph ? -35 : 8;

        this.options = {
            legend: {
                data: ['bar', 'bar2'],
                align: 'left'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params[0] && params[0].data && params[0].data.value) {
                        return `${params[0].name}<br>` +
                            `${params[0].marker} ${params[0].data.formatted} ${calories}`;
                    }
                    return `${params[0].name}`;
                }
            },
            grid,
            dataZoom: {
                show: true,
                type: 'inside'
            },
            xAxis: xAxisOptions,
            yAxis: {
                axisLabel: {
                    margin: yAxisMargin
                }
            },
            series: seriesOptions,
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            }
        };
        this.listIsEmpty = !seriesOptions.data.length;
    }

    updateGraph(measurements: Array<TimeSeries>): void {
        this.options.yAxis.axisLabel.margin = this.onlyGraph ? -35 : 8;
        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((calories: TimeSeries) => {
            if (calories.data_set) {
                calories.data_set.forEach((element: TimeSeriesItem) => {
                    this.options.xAxis.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    this.options.series.data.push({
                        value: element.value,
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });
                });
            }

        });

        this.listIsEmpty = !this.options.data.length;
        this.echartsInstance.setOption(this.options);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && changes.data.currentValue !== changes.data.previousValue) {
            this.completeDataSet();
        }
        if ((changes.filter && changes.filter.currentValue && changes.filter.previousValue
            && changes.filter.currentValue !== changes.filter.previousValue) ||
            (changes.filter && changes.filter.currentValue && !changes.filter.previousValue)) {
            this.applyFilter(this.filter);
        }
    }
}
