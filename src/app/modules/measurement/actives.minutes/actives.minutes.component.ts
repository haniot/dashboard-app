import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { TimeSeries, TimeSeriesItem, TimeSeriesType } from '../models/time.series';
import { SearchForPeriod } from '../models/measurement'

@Component({
    selector: 'actives-minutes',
    templateUrl: './actives.minutes.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class ActivesMinutesComponent implements OnInit, OnChanges {
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
    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.data = [];
        // this.measurementService
        //     .getAllByUserAndType(this.patientId, TimeSeriesType.heart_rate, null, null, filter)
        //     .then(httpResponse => {
        //         this.data = httpResponse.body;
        //         this.showSpinner = false;
        //         this.updateGraph(this.data);
        //         this.filterChange.emit(this.data);
        //     })
        //     .catch(() => {
        //         this.showSpinner = false;
        //     });
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
            color: '#AFE42C',
            data: [],
            barMaxWidth: '30%',
            animationDelay: function (idx) {
                return idx * 10;
            }
        };


        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        this.data.forEach((activesMinutes: TimeSeries) => {
            if (activesMinutes.data_set) {
                activesMinutes.data_set.forEach((element: TimeSeriesItem) => {
                    xAxisOptions.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    seriesOptions.data.push({
                        value: element.value,
                        time: this.datePipe.transform(element.date, 'mediumTime')
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
