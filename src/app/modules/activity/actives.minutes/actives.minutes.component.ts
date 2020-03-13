import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { TimeSeries, TimeSeriesItem, TimeSeriesType } from '../models/time.series';
import { TimeSeriesService } from '../services/time.series.service'
import * as echarts from 'echarts'

@Component({
    selector: 'actives-minutes',
    templateUrl: './actives.minutes.component.html',
    styleUrls: ['../../measurement/shared.style/shared.styles.scss']
})
export class ActivesMinutesComponent implements OnInit, OnChanges {
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

    applyFilter(event: any) {
        this.data = undefined;
        this.showSpinner = true;
        this.intraday = event.type === 'today';
        let service = 'getWithResource';
        if (event.type === 'today') {
            service = 'getWithResourceAndInterval';
        }
        this.timeSeriesService[service](this.patientId, TimeSeriesType.active_minutes, event.filter)
            .then((activeMinutes: TimeSeries) => {
                if (activeMinutes && activeMinutes.data_set) {
                    this.data = activeMinutes;
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

        const activeMinutes = this.translateService.instant('TIME-SERIES.ACTIVE-MINUTES.ACTIVE-MINUTES');

        if (this.intraday && this.data && this.data.data_set) {
            this.data.data_set.push({ time: '23:59:59' });
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
            : {
                show: !this.intraday,
                data: [],
                silent: false,
                splitLine: {
                    show: false
                }
            };

        const seriesOptions = this.intraday ?
            {
                type: 'line',
                step: true,
                itemStyle: {
                    color: '#AFE42C'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#AFE42C'
                    }, {
                        offset: 1,
                        color: '#AFE42C'
                    }])
                },
                data: []
            } : {
                type: 'bar',
                color: '#AFE42C',
                data: [],
                barMaxWidth: '30%',
                animationDelay: function (idx) {
                    return idx * 10;
                }
            };

        if (this.data && this.data.data_set) {
            if (this.intraday) {
                this.data.data_set.forEach((element: { time: string, value: number }) => {

                    xAxisOptions.data.push(element.time);
                    seriesOptions.data.push({
                        value: element.value,
                        formatted: element.value,
                        time: element.time
                    });

                });
            } else {
                this.data.data_set.forEach((element: TimeSeriesItem) => {

                    xAxisOptions.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    seriesOptions.data.push({
                        value: element.value,
                        formatted: element.value,
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });

                });
            }
        }

        const grid = [{ x: '5%', y: '7%', width: '92%', height: '88%' }];

        const yAxisMargin = this.onlyGraph ? -20 : 8;

        this.options = {
            legend: {
                data: ['bar', 'bar2'],
                align: 'left'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params[0] && params[0].data && params[0].data.formatted !== undefined) {
                        return `${params[0].name}<br>` +
                            `${params[0].marker} ${params[0].data.formatted} ${activeMinutes}`;
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
        this.options.yAxis.axisLabel.margin = this.onlyGraph ? -20 : 8;
        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((activeMinutes: TimeSeries) => {
            if (activeMinutes.data_set) {
                activeMinutes.data_set.forEach((element: TimeSeriesItem) => {
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
