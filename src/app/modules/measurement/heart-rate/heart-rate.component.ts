import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HeartRate} from '../models/heart-rate';
import {TranslateService} from "@ngx-translate/core";
import {Measurement, MeasurementType} from "../models/measurement";
import {MeasurementService} from "../services/measurement.service";

@Component({
    selector: 'heart-rate',
    templateUrl: './heart-rate.component.html',
    styleUrls: ['./heart-rate.component.scss']
})
export class HeartRateComponent implements OnInit, OnChanges {

    @Input() data: Array<HeartRate>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;

    lastData: HeartRate;

    options: any;

    optionsLastData: any;

    echartsInstance: any;

    showSpinner: boolean;


    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.data = new Array<HeartRate>();
        this.filter_visibility = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    loadGraph() {

        const historic_text = this.translateService.instant('MEASUREMENTS.HEART-RATE.HISTORIC.TEXT');
        const historic_subtext = this.translateService.instant('MEASUREMENTS.HEART-RATE.HISTORIC.SUBTEXT');
        const frequency = this.translateService.instant('MEASUREMENTS.HEART-RATE.FREQUENCY');

        const last_date_text = this.translateService.instant('MEASUREMENTS.HEART-RATE.LAST-DATE.TEXT');
        const last_date_subtext = this.translateService.instant('MEASUREMENTS.HEART-RATE.LAST-DATE.SUBTEXT');

        const date = this.translateService.instant('SHARED.DATE');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxisOptions = {data: []};

        const seriesOptions = {
            type: 'line',
            data: []
        };

        const xAxisOptionsLastDate = {data: []};

        const seriesOptionsLastDate = {
            type: 'line',
            data: []
        };

        this.data.forEach((heartRate) => {
            if (heartRate.dataset) {
                heartRate.dataset.forEach((date: { value: number, timestamp: string }) => {
                    xAxisOptions.data.push(this.datePipe.transform(date.timestamp, "shortDate"));
                    seriesOptions.data.push(date.value);
                });
            }
        });


        if (this.lastData) {
            // Inserindo dados no gráfico da ultima medião
            if (this.lastData.dataset) {
                this.lastData.dataset.forEach((date: { value: number, timestamp: string }) => {

                    xAxisOptionsLastDate.data.push(this.datePipe.transform(date.timestamp, "mediumTime"));

                    seriesOptionsLastDate.data.push(date.value);

                });
            }
        }

        this.options = {
            title: {
                text: historic_text,
                subtext: historic_subtext
            },
            tooltip: {
                formatter: frequency + ` : {c} bpm <br> ${date}: {b}`,
                trigger: 'axis'
            },
            xAxis: xAxisOptions,
            yAxis: {
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} bpm'
                }
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: seriesOptions
        };

        this.optionsLastData = {
            title: {
                text: last_date_text,
                subtext: last_date_subtext
            },
            tooltip: {
                formatter: frequency + ` : {c} bpm <br> ${date}: {b}`,
                trigger: 'axis'
            },
            xAxis: xAxisOptionsLastDate,
            yAxis: {
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} bpm'
                }
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: seriesOptionsLastDate
        };

    }

    applyFilter(filter: { start_at: string, end_at: string, period: string }) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.heart_rate, null, null, filter)
            .then((measurements: Array<any>) => {
                this.data = measurements;
                this.showSpinner = false;
                this.updateGraph(measurements);
            })
            .catch(errorResponse => {
                // this.toastService.error('Não foi possível buscar medições!');
                // console.log('Não foi possível buscar medições!', errorResponse);
            });
    }

    updateGraph(measurements: Array<HeartRate>): void {

        this.options.xAxis.data = new Array();
        this.options.series.data = new Array();

        measurements.forEach((heartRate: HeartRate) => {
            if (heartRate.dataset) {
                heartRate.dataset.forEach((date: { value: number, timestamp: string }) => {
                    this.options.xAxis.data.push(this.datePipe.transform(date.timestamp, "shortDate"));
                    this.options.series.data.push(date.value);
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
