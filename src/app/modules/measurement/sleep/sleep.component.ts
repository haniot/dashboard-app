import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'

import { TranslateService } from '@ngx-translate/core'
import * as echarts from 'echarts'

import { MeasurementService } from '../services/measurement.service'
import { SleepPipe } from '../pipes/sleep.pipe'
import { Sleep } from '../models/sleep'
import { DecimalFormatterPipe } from '../pipes/decimal.formatter.pipe'
import { EnumMeasurementType } from '../models/measurement'

@Component({
    selector: 'sleep',
    templateUrl: './sleep.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class SleepComponent implements OnInit {
    @Input() data: Array<Sleep>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;
    lastData: Sleep;
    sleepSelected: Sleep;
    options: any;
    sleepStages: any;
    echartSleepInstance: any;
    echartStagesInstance: any;
    showSpinner: boolean;
    showSleepStages: boolean;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private sleepPipe: SleepPipe,
        private decimalFormatter: DecimalFormatterPipe
    ) {
    }

    ngOnInit() {
        this.loadGraph();
    }

    applyFilter(filter: { start_at: string, end_at: string, period: string }) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.sleep, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
            })
            .catch();
    }

    loadGraph() {
        const MAX_SLEEP_VALUE = 12;
        const IDEAL_SLEEP_VALUE = 8;

        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');
        const hours = this.translateService.instant('MYDATEPIPE.HOURS');
        const hours_abbreviation = this.translateService.instant('HABITS.SLEEP.TIME-ABBREVIATION');
        const duration = this.translateService.instant('MEASUREMENTS.SLEEP.DURATION');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxis = { data: [] };
        const series = [
            {
                type: 'bar',
                barMaxWidth: 50,
                itemStyle: {
                    normal: { color: 'rgba(0,0,0,0.05)' }
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: [],
                animation: false
            },
            {
                type: 'bar',
                barMaxWidth: 50,
                label: {
                    show: true,
                    color: '#FFFFFF',
                    position: 'top',
                    distance: -20,
                    verticalAlign: 'middle',
                    rotate: 0,
                    formatter: '{c} ' + hours_abbreviation,
                    fontSize: 16
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#25c5b5' },
                                { offset: 0.5, color: '#00a594' },
                                { offset: 1, color: '#00a594' }
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#25c5b5' },
                                { offset: 0.7, color: '#00a594' },
                                { offset: 1, color: '#00a594' }
                            ]
                        )
                    }
                },
                data: [],
                markLine: {
                    silent: true,
                    data: [{
                        label: {
                            formatter: ''
                        },
                        yAxis: 8
                    }]
                }
            }
        ];

        this.data.forEach((element: Sleep) => {
            xAxis.data.push(this.datePipe.transform(element.start_time, 'shortDate'));
            series[0].data.push(MAX_SLEEP_VALUE);
            series[1].data.push({
                value: parseFloat(this.decimalFormatter.transform(element.duration / 3600000)),
                time: this.datePipe.transform(element.start_time, 'mediumTime')
            });
        });

        const yAxis = {
            data: []
        }

        for (let i = 0; i <= MAX_SLEEP_VALUE; i++) {
            i === IDEAL_SLEEP_VALUE ? yAxis.data.push(`${i} ${hours}`) : yAxis.data.push(i)
        }

        this.options = {
            tooltip: {
                formatter: function (params) {
                    return `${duration}: ${params.data.value} ${hours} <br> ${date}: <br> ${params.name} ${at} ${params.data.time}`;
                }
            },
            xAxis,
            yAxis,
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series
        };


    }

    loadSleepGraph(selected: any): void {
        this.sleepSelected = this.data[selected.dataIndex]
        this.showSleepStages = true;

        const hs = this.translateService.instant('SLEEP.TIME-ABBREVIATION');
        const awake = this.translateService.instant('MEASUREMENTS.PIPES.SLEEP.AWAKE');
        const restless = this.translateService.instant('MEASUREMENTS.PIPES.SLEEP.RESTLESS');
        const asleep = this.translateService.instant('MEASUREMENTS.PIPES.SLEEP.ASLEEP');

        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');
        const duration = this.translateService.instant('MEASUREMENTS.SLEEP.DURATION');

        const { pattern: { data_set } } = this.sleepSelected;

        const sleepStageXAxisData = [];
        const sleepStageData = [];

        data_set.forEach(elemento => {
            const newElement = {
                time: this.datePipe.transform(elemento.start_time, 'mediumTime'),
                date_and_hour: this.datePipe.transform(elemento.start_time, 'shortDate') + ' ' + at
                    + ' ' + this.datePipe.transform(elemento.start_time, 'mediumTime'),
                stage: this.translateService.instant(this.sleepPipe.transform(elemento.name)),
                duration: (elemento.duration / 60000) + ' ' + this.translateService.instant('HABITS.SLEEP.MINUTES-ABBREVIATION')
            }
            switch (elemento.name) {
                case 'restless':
                    sleepStageData.push({ ...newElement, value: 1 });
                    break;

                case 'asleep':
                    sleepStageData.push({ ...newElement, value: 2 });
                    break;

                case 'awake':
                    sleepStageData.push({ ...newElement, value: 3 });
                    break;
            }
            sleepStageXAxisData.push(this.datePipe.transform(elemento.start_time, 'mediumTime'))

        })


        this.sleepStages = {
            tooltip: {
                formatter: function (params) {
                    const stage = params.data.stage
                    const time_duration = params.data.duration;

                    return `${stage} <br> ${duration}: ${time_duration} <br> ${date}: <br> ${params.data.date_and_hour}`;
                }
            },
            xAxis: {
                data: sleepStageXAxisData
            },
            yAxis: {
                axisLabel: {
                    formatter: function (params) {
                        switch (params) {
                            case 3:
                                return awake

                            case 2:
                                return restless

                            case 1:
                                return asleep

                        }

                    }
                }
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],

            visualMap: {
                show: false,
                type: 'continuous',
                min: 0,
                max: 3,
                color: ['#ff1012', '#25c5b5', '#0402EC']
            },

            series:
                {
                    type: 'line',
                    step: 'middle',
                    lineStyle: {
                        normal: {
                            width: 6
                        }
                    },
                    color: '#25c5b5',
                    data: sleepStageData
                }
        };


    }

    updateGraph(measurements: Array<any>): void {
        const MAX_SLEEP_VALUE = 12;

        // clean weightGraph
        this.options.xAxis.data = [];
        this.options.series[0].data = [];
        this.options.series[1].data = [];

        measurements.forEach((element: Sleep) => {
            this.options.xAxis.data.push(this.datePipe.transform(element.start_time, 'shortDate'));
            this.options.series[0].data.push(MAX_SLEEP_VALUE);
            this.options.series[1].data.push({
                value: parseFloat(this.decimalFormatter.transform(element.duration / 3600000)),
                time: this.datePipe.transform(element.start_time, 'mediumTime')
            });
        });

        this.echartSleepInstance.setOption(this.options);
    }

    back(): void {
        this.showSleepStages = false;
    }

    onSleepChartInit(event) {
        this.echartSleepInstance = event;
    }

    onStagesChartInit(event) {
        this.echartStagesInstance = event;
    }
}
