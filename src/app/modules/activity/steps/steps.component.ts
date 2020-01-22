import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { TimeSeries, TimeSeriesItem, TimeSeriesType } from '../models/time.series'
import { TimeSeriesService } from '../services/time.series.service'

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
    options: any;
    echartsInstance: any;
    @Input() listIsEmpty: boolean;

    constructor(
        private datePipe: DatePipe,
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
        this.timeSeriesService[service](this.patientId, TimeSeriesType.steps, event.filter)
            .then((step: TimeSeries) => {
                if (step && step.data_set) {
                    this.data = step;
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
            data: [],
            silent: false,
            splitLine: {
                show: false
            }
        };

        const seriesOptions = {
            type: 'bar',
            data: [],
            color: '#E97493',
            barMaxWidth: 30,
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
                        time: elementStep.time
                    });
                });
            } else {
                this.data.data_set.forEach((elementStep: TimeSeriesItem) => {
                    xAxisOptions.data.push(this.datePipe.transform(elementStep.date, 'shortDate'));
                    seriesOptions.data.push({
                        value: elementStep.value,
                        time: this.datePipe.transform(elementStep.date, 'mediumTime')
                    });
                });
            }
        }

        this.options = {
            legend: {
                data: ['bar', 'bar2'],
                align: 'left'
            },
            tooltip: {},
            dataZoom: {
                show: true
            },
            xAxis: xAxisOptions,
            yAxis: {},
            series: seriesOptions
        };

    }

    updateGraph(measurements: Array<TimeSeries>): void {

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

        this.echartsInstance.setOption(this.options);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && changes.data.currentValue !== changes.data.previousValue) {
            this.loadGraph();
        }
    }

}