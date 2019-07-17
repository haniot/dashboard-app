import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';

import {IMeasurement, Measurement, MeasurementType} from '../models/measurement';
import {DecimalFormatterPipe} from "../pipes/decimal-formatter.pipe";
import {TranslateService} from "@ngx-translate/core";
import {Weight} from "../models/weight";
import {MeasurementService} from "../services/measurement.service";

@Component({
    selector: 'body-temperature',
    templateUrl: './body-temperature.component.html',
    styleUrls: ['./body-temperature.component.scss']
})
export class BodyTemperatureComponent implements OnInit, OnChanges {

    @Input() data: Array<IMeasurement>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;

    lastData: IMeasurement;

    options: any;

    showSpinner: boolean;

    echartsInstance: any;

    constructor(
        private datePipe: DatePipe,
        private decimalPipe: DecimalFormatterPipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.data = new Array<Measurement>();
        this.lastData = new Measurement();
        this.filter_visibility = false;
        this.patientId = "";
        this.showSpinner = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    loadGraph() {

        const historic_temperature = this.translateService.instant('MEASUREMENTS.BODY-TEMPERATURE.TEMPERATURE-HISTORIC');
        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');
        const temperature = this.translateService.instant('MEASUREMENTS.BODY-TEMPERATURE.TEMPERATURE');
        const date = this.translateService.instant('SHARED.DATE');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxis = {
            type: 'category',
            boundaryGap: false,
            data: []
        };

        const series = {
            name: historic_temperature,
            type: 'line',
            data: [],
            markPoint: {
                data: [
                    {type: 'max', name: max},
                    {type: 'min', name: min}
                ]
            }
        };

        this.data.forEach((element: Measurement) => {
            xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            series.data.push(this.decimalPipe.transform(element.value));
        });


        this.options = {
            tooltip: {
                formatter: temperature + `: {c} °C <br> ${date}: {b}`,
                trigger: 'axis'
            },
            xAxis: xAxis,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: series
        };

    }

    applyFilter(filter: { start_at: string, end_at: string, period: string }) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.body_temperature, null, null, filter)
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

    updateGraph(measurements: Array<any>): void {
        // clean
        this.options.xAxis.data = new Array<any>();
        this.options.series.data = new Array<any>();

        measurements.forEach((element: Weight) => {
            this.options.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            this.options.series.data.push(element.value);
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
