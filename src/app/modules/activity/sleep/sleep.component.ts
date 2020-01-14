import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';
import { PageEvent } from '@angular/material';
import { ToastrService } from 'ngx-toastr'
import { SleepPipe } from '../pipes/sleep.pipe';
import {
    Sleep,
    SleepPattern,
    SleepPatternPhaseSummary,
    SleepPatternStageSummary,
    SleepPatternSummaryData,
    SleepType
} from '../models/sleep';
import { DecimalFormatterPipe } from '../../measurement/pipes/decimal.formatter.pipe';
import { SearchForPeriod } from '../../measurement/models/measurement';
import { ConfigurationBasic } from '../../config.matpaginator';
import { ActivatedRoute } from '@angular/router'
import { SleepService } from '../services/sleep.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'sleep',
    templateUrl: './sleep.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class SleepComponent implements OnInit {
    @Input() data: Array<Sleep>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    lastData: Sleep;
    sleepSelected: Sleep;
    options: any;
    sleepStages: any;
    echartSleepInstance: any;
    echartStagesInstance: any;
    showSleepStages: boolean;
    Math: any;
    sleepTypes = SleepType
    listIsEmpty: boolean;
    filter: SearchForPeriod;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    loadingMeasurements: boolean;
    modalConfirmRemoveMeasurement: boolean;
    cacheIdMeasurementRemove: string;
    cacheListIdMeasurementRemove: Array<any>;
    selectAll: boolean;
    listCheckMeasurements: Array<boolean>;
    stateButtonRemoveSelected: boolean;

    constructor(
        private activeRouter: ActivatedRoute,
        private datePipe: DatePipe,
        private sleepService: SleepService,
        private translateService: TranslateService,
        private sleepPipe: SleepPipe,
        private decimalFormatter: DecimalFormatterPipe,
        private toastService: ToastrService
    ) {
        this.Math = Math;
        this.data = new Array<Sleep>();
        this.filterVisibility = false;
        this.patientId = '';
        this.showSpinner = false;
        this.filterChange = new EventEmitter();
        this.listCheckMeasurements = new Array<boolean>();
        this.cacheListIdMeasurementRemove = new Array<string>();
        this.cacheIdMeasurementRemove = '';
        this.stateButtonRemoveSelected = false;
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.filter = new SearchForPeriod();
        this.loadingMeasurements = false;
        this.modalConfirmRemoveMeasurement = false;
        this.selectAll = false;
        this.listIsEmpty = false;
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.filterVisibility = true;
            this.includeCard = true;

            const sleep = new Sleep()
            sleep.type = SleepType.CLASSIC;
            sleep.start_time = '2018-08-18T01:40:30.00Z';
            sleep.end_time = '2018-08-18T09:36:30.00Z';
            sleep.duration = 29520000;
            sleep.pattern = new SleepPattern()
            sleep.pattern.data_set = [
                {
                    start_time: '2018-08-18T01:40:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:41:30.00Z',
                    name: 'asleep',
                    duration: 360000
                },
                {
                    start_time: '2018-08-18T01:47:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T01:51:30.00Z',
                    name: 'asleep',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:52:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:53:30.00Z',
                    name: 'asleep',
                    duration: 2100000
                },
                {
                    start_time: '2018-08-18T02:28:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T02:32:30.00Z',
                    name: 'awake',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T02:35:30.00Z',
                    name: 'asleep',
                    duration: 15120000
                },
                {
                    start_time: '2018-08-18T06:47:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T06:48:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T07:31:30.00Z',
                    name: 'restless',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:33:30.00Z',
                    name: 'asleep',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:35:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:36:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T07:56:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:57:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T08:40:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T08:43:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T09:04:30.00Z',
                    name: 'asleep',
                    duration: 1740000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T09:36:30.00Z',
                    name: 'asleep',
                    duration: 960000
                }
            ];

            sleep.pattern.summary = new SleepPatternPhaseSummary();
            sleep.pattern.summary.asleep = new SleepPatternSummaryData()
            sleep.pattern.summary.asleep.count = 55;
            sleep.pattern.summary.asleep.duration = 28020000;

            sleep.pattern.summary.awake = new SleepPatternSummaryData()
            sleep.pattern.summary.awake.count = 5;
            sleep.pattern.summary.awake.duration = 28020000;

            sleep.pattern.summary.restless = new SleepPatternSummaryData()
            sleep.pattern.summary.restless.count = 40;
            sleep.pattern.summary.restless.duration = 28020000;

            const sleep3 = new Sleep()
            sleep3.type = SleepType.CLASSIC;
            sleep3.start_time = '2018-08-18T01:40:30.00Z';
            sleep3.end_time = '2018-08-18T09:36:30.00Z';
            sleep3.duration = 34420000;
            sleep3.pattern = new SleepPattern()
            sleep3.pattern.data_set = [
                {
                    start_time: '2018-08-18T01:40:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:41:30.00Z',
                    name: 'asleep',
                    duration: 360000
                },
                {
                    start_time: '2018-08-18T01:47:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T01:51:30.00Z',
                    name: 'asleep',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:52:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:53:30.00Z',
                    name: 'asleep',
                    duration: 2100000
                },
                {
                    start_time: '2018-08-18T02:28:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T02:32:30.00Z',
                    name: 'awake',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T02:35:30.00Z',
                    name: 'asleep',
                    duration: 15120000
                },
                {
                    start_time: '2018-08-18T06:47:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T06:48:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T07:31:30.00Z',
                    name: 'restless',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:33:30.00Z',
                    name: 'asleep',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:35:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:36:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T07:56:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:57:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T08:40:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T08:43:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T09:04:30.00Z',
                    name: 'asleep',
                    duration: 1740000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T09:36:30.00Z',
                    name: 'asleep',
                    duration: 960000
                }
            ];

            sleep3.pattern.summary = new SleepPatternPhaseSummary();
            sleep3.pattern.summary.asleep = new SleepPatternSummaryData()
            sleep3.pattern.summary.asleep.count = 63;
            sleep3.pattern.summary.asleep.duration = 28020000;

            sleep3.pattern.summary.awake = new SleepPatternSummaryData()
            sleep3.pattern.summary.awake.count = 7;
            sleep3.pattern.summary.awake.duration = 28020000;

            sleep3.pattern.summary.restless = new SleepPatternSummaryData()
            sleep3.pattern.summary.restless.count = 30;
            sleep3.pattern.summary.restless.duration = 28020000;

            const sleep2 = new Sleep()
            sleep2.type = SleepType.STAGES;
            sleep2.start_time = '2018-08-18T01:40:30.00Z';
            sleep2.end_time = '2018-08-18T09:36:30.00Z';
            sleep2.duration = 39720000;
            sleep2.pattern = new SleepPattern()
            sleep2.pattern.data_set = [
                {
                    start_time: '2018-08-18T01:40:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:41:30.00Z',
                    name: 'asleep',
                    duration: 360000
                },
                {
                    start_time: '2018-08-18T01:47:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T01:51:30.00Z',
                    name: 'asleep',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:52:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:53:30.00Z',
                    name: 'asleep',
                    duration: 2100000
                },
                {
                    start_time: '2018-08-18T02:28:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T02:32:30.00Z',
                    name: 'awake',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T02:35:30.00Z',
                    name: 'asleep',
                    duration: 15120000
                },
                {
                    start_time: '2018-08-18T06:47:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T06:48:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T07:31:30.00Z',
                    name: 'restless',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:33:30.00Z',
                    name: 'asleep',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:35:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:36:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T07:56:30.00Z',
                    name: 'restless',
                    duration: 60000
                }
            ];

            sleep2.pattern.summary = new SleepPatternStageSummary();
            sleep2.pattern.summary.deep = new SleepPatternSummaryData()
            sleep2.pattern.summary.deep.count = 45;
            sleep2.pattern.summary.deep.duration = 28020000;

            sleep2.pattern.summary.light = new SleepPatternSummaryData()
            sleep2.pattern.summary.light.count = 50;
            sleep2.pattern.summary.light.duration = 28020000;

            sleep2.pattern.summary.rem = new SleepPatternSummaryData()
            sleep2.pattern.summary.rem.count = 50;
            sleep2.pattern.summary.rem.duration = 28020000;

            sleep2.pattern.summary.awake = new SleepPatternSummaryData()
            sleep2.pattern.summary.awake.count = 5;
            sleep2.pattern.summary.awake.duration = 28020000;

            this.data = [sleep, sleep2, sleep3];
        })
        this.loadGraph();
    }

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.sleepService.getAll(this.patientId, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
                this.filterChange.emit(this.data);
            })
            .catch(() => {
                this.showSpinner = false;
            });
    }

    loadGraph() {
        const MAX_SLEEP_VALUE = 12;
        const IDEAL_SLEEP_VALUE = 8;

        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');
        const hours = this.translateService.instant('MYDATEPIPE.HOURS');
        const hours_abbreviation = this.translateService.instant('HABITS.SLEEP.TIME-ABBREVIATION');
        const duration = this.translateService.instant('ACTIVITY.SLEEP.DURATION');
        const title = this.translateService.instant('ACTIVITY.SLEEP.CLICK-TO-VIEW');
        const viewStages = this.translateService.instant('ACTIVITY.SLEEP.VIEW-STAGES');
        const and = this.translateService.instant('SHARED.AND');
        const minutes_abbreviation = this.translateService.instant('HABITS.SLEEP.MINUTES-ABBREVIATION');

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
                    distance: -30,
                    verticalAlign: 'middle',
                    rotate: 0,
                    formatter: function (params) {
                        const { data: { value } } = params;
                        return `${value.toFixed(1)}\n${hours_abbreviation}`
                    },
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
                        yAxis: IDEAL_SLEEP_VALUE
                    }]
                }
            }
        ];

        this.data.forEach((element: Sleep) => {
            xAxis.data.push(this.datePipe.transform(element.start_time, 'shortDate'));
            series[0].data.push(MAX_SLEEP_VALUE);
            series[1].data.push({
                value: element.duration / 3600000,
                time: this.datePipe.transform(element.start_time, 'mediumTime')
            });
        });

        const yAxis = {
            min: 0,
            max: MAX_SLEEP_VALUE,
            axisLabel: {
                formatter: function (value) {
                    return `${value} ${hours_abbreviation}`
                }
            }
        }

        // for (let i = 0; i <= MAX_SLEEP_VALUE; i++) {
        //     i === IDEAL_SLEEP_VALUE ? yAxis.data.push({ value: i, label: `${i} ${hours}` }) : yAxis.data.push(i)
        // }

        this.options = {
            title: {
                subtext: title
            },
            tooltip: {
                formatter: function (params) {
                    const hours_trucate = Math.floor(params.data.value);
                    const minutes = Math.floor(((params.data.value * 3600000) % 3600000) / 60000);
                    return `${duration}: ${hours_trucate + hours_abbreviation} ${minutes ? and + ' '
                        + minutes + minutes_abbreviation : ''}  <br>` +
                        `${date}: <br> ${params.name} ${at} ${params.data.time}`;
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

        this.initializeListCheckMeasurements();
    }

    loadSleepGraph(selected: any): void {
        this.sleepSelected = this.data[selected.dataIndex]
        this.showSleepStages = true;
        if (this.sleepSelected) {
            switch (this.sleepSelected.type) {
                case SleepType.CLASSIC:
                    this.loadSleepGraphClassic(selected);
                    break;

                case SleepType.STAGES:
                    this.loadSleepGraphStages(selected)
                    break
            }
        }
    }

    loadSleepGraphClassic(selected: any): void {
        const hs = this.translateService.instant('SLEEP.TIME-ABBREVIATION');
        const awake = this.translateService.instant('ACTIVITY.PIPES.SLEEP.AWAKE');
        const restless = this.translateService.instant('ACTIVITY.PIPES.SLEEP.RESTLESS');
        const asleep = this.translateService.instant('ACTIVITY.PIPES.SLEEP.ASLEEP');

        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');
        const duration = this.translateService.instant('ACTIVITY.SLEEP.DURATION');

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
                                return asleep

                            case 1:
                                return restless

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

    loadSleepGraphStages(selected: any): void {
        const hs = this.translateService.instant('SLEEP.TIME-ABBREVIATION');
        const deep = this.translateService.instant('ACTIVITY.PIPES.SLEEP.DEEP');
        const light = this.translateService.instant('ACTIVITY.PIPES.SLEEP.LIGHT');
        const rem = this.translateService.instant('ACTIVITY.PIPES.SLEEP.REM');
        const awake = this.translateService.instant('ACTIVITY.PIPES.SLEEP.AWAKE');

        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');
        const duration = this.translateService.instant('ACTIVITY.SLEEP.DURATION');

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
                case 'deep':
                    sleepStageData.push({ ...newElement, value: 1 });
                    break;

                case 'light':
                    sleepStageData.push({ ...newElement, value: 2 });
                    break;

                case 'rem':
                    sleepStageData.push({ ...newElement, value: 3 });
                    break;

                case 'awake':
                    sleepStageData.push({ ...newElement, value: 4 });
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
                            case 4:
                                return awake

                            case 3:
                                return rem

                            case 2:
                                return light

                            case 1:
                                return deep

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
                max: 4,
                color: ['#ff1012', '#7EC4FF', '#25c5b5', '#0402EC']
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

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.loadMeasurements();
    }

    changeOnMeasurement(): void {
        const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
        this.selectAll = this.data.length === measurementsSelected.length;
        this.updateStateButtonRemoveSelected();
    }

    closeModalConfimation() {
        this.cacheIdMeasurementRemove = '';
        this.modalConfirmRemoveMeasurement = false;
    }

    loadMeasurements(): any {
        this.sleepService
            .getAll(this.patientId, this.page, this.limit, this.filter)
            .then((httpResponse) => {
                this.data = httpResponse.body;
                this.listIsEmpty = this.data.length === 0;
                this.initializeListCheckMeasurements();
            })
            .catch(() => {
                this.listIsEmpty = true;
            });
    }

    openModalConfirmation(measurementId: string) {
        this.cacheIdMeasurementRemove = measurementId;
        this.modalConfirmRemoveMeasurement = true;
    }

    initializeListCheckMeasurements(): void {
        this.selectAll = false;
        this.listCheckMeasurements = new Array<boolean>(this.data.length);
        for (let i = 0; i < this.listCheckMeasurements.length; i++) {
            this.listCheckMeasurements[i] = false;
        }
        this.updateStateButtonRemoveSelected();
    }

    async removeMeasurement(): Promise<any> {
        this.loadingMeasurements = true;
        if (!this.cacheListIdMeasurementRemove || !this.cacheListIdMeasurementRemove.length) {
            this.sleepService.remove(this.patientId, this.cacheIdMeasurementRemove)
                .then(measurements => {
                    this.applyFilter(this.filter);
                    this.loadingMeasurements = false;
                    this.modalConfirmRemoveMeasurement = false;
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-REMOVED'));
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-NOT-REMOVED'));
                    this.loadingMeasurements = false;
                    this.modalConfirmRemoveMeasurement = false;
                })
        } else {
            let occuredError = false;
            for (let i = 0; i < this.cacheListIdMeasurementRemove.length; i++) {
                try {
                    const measurementRemove = this.cacheListIdMeasurementRemove[i];
                    await this.sleepService.remove(this.patientId, measurementRemove.id);
                } catch (e) {
                    occuredError = true;
                }
            }
            occuredError ? this.toastService
                    .error(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-NOT-REMOVED'))
                : this.toastService.info(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-REMOVED'));

            this.applyFilter(this.filter);
            this.loadingMeasurements = false;
            this.modalConfirmRemoveMeasurement = false;
        }
    }

    removeSelected() {
        const measurementsIdSelected: Array<string> = new Array<string>();
        this.listCheckMeasurements.forEach((element, index) => {
            if (element) {
                measurementsIdSelected.push(this.data[index].id);
            }
        })
        this.cacheListIdMeasurementRemove = measurementsIdSelected;
        this.modalConfirmRemoveMeasurement = true;
    }

    selectAllMeasurements(): void {
        const attribSelectAll = (element: any) => {
            return !this.selectAll;
        }
        this.listCheckMeasurements = this.listCheckMeasurements.map(attribSelectAll);
        this.updateStateButtonRemoveSelected();
    }

    updateStateButtonRemoveSelected(): void {
        const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
        this.stateButtonRemoveSelected = !!measurementsSelected.length;
    }

    trackById(index, item) {
        return item.id;
    }
}
