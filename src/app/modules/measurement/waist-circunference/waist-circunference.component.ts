import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';

import {IMeasurement, Measurement, MeasurementType} from '../models/measurement';
import {TranslateService} from "@ngx-translate/core";
import {Weight} from "../models/wieght";
import {MeasurementService} from "../services/measurement.service";

@Component({
    selector: 'waist-circunference',
    templateUrl: './waist-circunference.component.html',
    styleUrls: ['./waist-circunference.component.scss']
})
export class WaistCircunferenceComponent implements OnInit, OnChanges {

    @Input() data: Array<IMeasurement>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;

    lastData: IMeasurement;

    options: any;

    showSpinner: boolean;

    echartsInstance: any;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.data = new Array<Measurement>();
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

        const circumference = this.translateService.instant('MEASUREMENTS.WAIST-CIRCUMFERENCE.CIRCUMFERENCE');
        const average = this.translateService.instant('MEASUREMENTS.AVERAGE');
        const average_value = this.translateService.instant('MEASUREMENTS.AVERAGE-VALUE');
        const date = this.translateService.instant('SHARED.DATE');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxis = {
            type: 'category',
            data: [],
            axisTick: {
                alignWithLabel: true
            }
        };

        const series = {
            type: 'bar',
            barWidth: '60%',
            color: '#00a594',
            data: [],
            markLine: {
                tooltip: {
                    trigger: 'item',
                    formatter: average_value + " : {c} cm"
                },
                lineStyle: {
                    color: 'black',
                },
                data: [
                    {type: 'average', name: average}
                ]
            }
        };


        this.data.forEach((element: Measurement) => {
            xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            series.data.push(element.value);
        });


        this.options = {
            color: ['#3398DB'],
            tooltip: {
                formatter: circumference + `: {c} cm <br> ${date}: {b}`,
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: xAxis,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} cm'
                    }
                }
            ],
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: series
        };

    }

    applyFilter(event: any) {
        let filter: { start_at: string, end_at: string, period: string };
        if (event === 'today' || event === '1w' || event === '1m' || event === '1y') {
            filter = {start_at: null, end_at: new Date().toISOString().split('T')[0], period: event};
        } else {
            const start_at = event.begin.toISOString().split('T')[0];
            const end_at = event.end.toISOString().split('T')[0];
            filter = {start_at, end_at, period: null};
        }
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.waist_circumference, null, null, filter)
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
