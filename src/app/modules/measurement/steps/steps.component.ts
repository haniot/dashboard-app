import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { TimeSeries, TimeSeriesItem } from '../models/time.series'
import { SearchForPeriod } from '../models/measurement'

@Component({
    selector: 'steps',
    templateUrl: './steps.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class StepsComponent implements OnInit, OnChanges {
    @Input() data: Array<TimeSeries>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    lastData: TimeSeries;
    options: any;
    echartsInstance: any;
    listIsEmpty: boolean;

    constructor(
        private datePipe: DatePipe,
        private translateService: TranslateService
    ) {
        this.data = new Array<TimeSeries>();
        this.filterVisibility = false;
        this.patientId = '';
        this.showSpinner = false;
        this.filterChange = new EventEmitter();
        this.listIsEmpty = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    applyFilter(filter: SearchForPeriod): void {

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


        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        this.data.forEach((step) => {
            if (step.data_set) {
                step.data_set.forEach((elementStep: TimeSeriesItem) => {
                    xAxisOptions.data.push(this.datePipe.transform(elementStep.date, 'shortDate'));
                    seriesOptions.data.push({
                        value: elementStep.value,
                        time: this.datePipe.transform(elementStep.date, 'mediumTime')
                    });
                });
            }
        });

        this.options = {
            legend: {
                data: ['bar', 'bar2'],
                align: 'left'
            },
            tooltip: {},
            xAxis: xAxisOptions,
            yAxis: {},
            series: seriesOptions,
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            }
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
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }

}
