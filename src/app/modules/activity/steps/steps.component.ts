import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { TimeSeries, TimeSeriesItem, TimeSeriesType } from '../models/time.series'
import { TimeSeriesService } from '../services/time.series.service'
import * as echarts from 'echarts'

@Component({
    selector: 'steps',
    templateUrl: './steps.component.html',
    styleUrls: ['../../measurement/shared.style/shared.styles.scss']
})
export class StepsComponent implements OnInit, OnChanges {
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
        private timeSeriesService: TimeSeriesService,
        private translateService: TranslateService
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
        this.timeSeriesService[service](this.patientId, TimeSeriesType.steps, event.filter)
            .then((step: TimeSeries) => {
                if (step && step.data_set) {
                    this.data = step;
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

        const steps = this.translateService.instant('TIME-SERIES.STEPS.STEPS');

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
                    color: '#E97493'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#E97493'
                    }, {
                        offset: 1,
                        color: '#E97493'
                    }])
                },
                data: []
            }
            : {
                type: 'bar',
                data: [],
                color: '#E97493',
                barMaxWidth: '50px',
                animationDelay: function (idx) {
                    return idx * 10;
                }
            };

        if (this.data && this.data.data_set) {
            if (this.intraday) {
                this.data.data_set.forEach((elementStep: { time: string, value: string }) => {

                    xAxisOptions.data.push(elementStep.time);
                    seriesOptions.data.push({
                        value: elementStep.value,
                        formatted: this.numberPipe.transform(elementStep.value, '1.0-0'),
                        time: elementStep.time
                    });

                });
            } else {
                this.data.data_set.forEach((elementStep: TimeSeriesItem) => {

                    xAxisOptions.data.push(this.datePipe.transform(elementStep.date, 'shortDate'));
                    seriesOptions.data.push({
                        value: elementStep.value,
                        formatted: this.numberPipe.transform(elementStep.value, '1.0-0'),
                        time: this.datePipe.transform(elementStep.date, 'mediumTime')
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
                    if (params[0] && params[0].data && params[0].data.formatted) {
                        return `${params[0].name}<br>` +
                            `${params[0].marker} ${params[0].data.formatted} ${steps}`;
                    }
                    return  `${params[0].name}`;
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
            series: seriesOptions
        };
        this.listIsEmpty = !seriesOptions.data.length;
    }

    updateGraph(measurements: Array<TimeSeries>): void {
        this.options.yAxis.axisLabel.margin = this.onlyGraph ? -35 : 8;
        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((step: TimeSeries) => {
            if (step.data_set) {
                step.data_set.forEach((element: TimeSeriesItem) => {
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
