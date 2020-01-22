import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TimeSeries, TimeSeriesItem, TimeSeriesType } from '../models/time.series';
import { TimeSeriesService } from '../services/time.series.service'

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
    options: any;
    echartsInstance: any;
    Math = Math;

    constructor(
        private datePipe: DatePipe,
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
        this.timeSeriesService[service](this.patientId, TimeSeriesType.calories, event.filter)
            .then((calories: TimeSeries) => {
                if (calories && calories.data_set) {
                    this.data = calories;
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

        const light = this.translateService.instant('TIME-SERIES.LEVELS.LIGHT');
        const moderate = this.translateService.instant('TIME-SERIES.LEVELS.MODERATE');
        const intense = this.translateService.instant('TIME-SERIES.LEVELS.INTENSE');

        const xAxisOptions = {
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
                        value: Math.floor(element.value),
                        time: element.time
                    });
                });
            } else {
                this.data.data_set.forEach((element: TimeSeriesItem) => {
                    xAxisOptions.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    seriesOptions.data.push({
                        value: Math.floor(element.value),
                        time: this.datePipe.transform(element.date, 'mediumTime')
                    });
                });
            }
        }

        this.options = {
            legend: {
                data: ['bar', 'bar2'],
                align: 'left'
            },
            // visualMap: {
            //     orient: 'horizontal',
            //     top: 20,
            //     right: 0,
            //     pieces: [{
            //         gt: 0,
            //         lte: 35.7,
            //         color: '#FDC133',
            //         label: light
            //
            //     }, {
            //         gt: 35.7,
            //         lte: 37.5,
            //         color: '#FC7D35',
            //         label: moderate
            //
            //     }, {
            //         gt: 37.5,
            //         color: '#AFE42C',
            //         label: intense
            //     }]
            // },
            tooltip: {},
            dataZoom: {
                show: true
            },
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

        this.echartsInstance.setOption(this.options);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && changes.data.currentValue !== changes.data.previousValue) {
            this.loadGraph();
        }
    }
}
