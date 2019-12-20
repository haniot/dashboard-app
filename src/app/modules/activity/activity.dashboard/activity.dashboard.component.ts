import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as echarts from 'echarts'

import { TimeSeriesType } from '../models/time.series';
import { Sleep, SleepPattern, SleepPatternSummaryData } from '../models/sleep';
import { PatientService } from '../../patient/services/patient.service';
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service';
import { NutritionalQuestionnairesService } from '../../habits/services/nutritional.questionnaires.service';
import { OdontologicalQuestionnairesService } from '../../habits/services/odontological.questionnaires.service';
import { SleepPipe } from '../pipes/sleep.pipe';
import { PhysicalActivity } from '../models/physical.activity'

@Component({
    selector: 'activity-dashboard',
    templateUrl: './activity.dashboard.component.html',
    styleUrls: ['./activity.dashboard.component.scss']
})
export class ActivityDashboardComponent implements OnInit {
    @Input() patientId: string;
    activityGraph: any
    activityCalorieGraph: any;
    currentDate: Date;
    timeSeriesTypes: any;
    measurementSelected: TimeSeriesType;
    sleepSize: number;
    sleepStages: any;
    sleepSelected: Sleep;
    sleepHover: boolean;
    stepsHover: boolean;
    stepsValue: number;
    stepSize: number;
    caloriesHover: boolean;
    caloriesValue: number;
    activeMinutesHover: boolean;
    activeMinutesValue: number;
    activeMinutesSettings: boolean;
    distanceHover: boolean;
    distanceValue: number;
    innerWidth: any;
    listActivities: PhysicalActivity[];
    listActivitiesIsEmpty: boolean;
    Math = Math;
    @ViewChild('sleepDiv', { static: false }) sleepDivRef: ElementRef;

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.innerWidth = window.innerWidth;
        if (this.sleepDivRef) {
            this.sleepSize = this.sleepDivRef.nativeElement.offsetWidth - (this.sleepDivRef.nativeElement.offsetWidth * 0.27);
        }
    }

    constructor(
        private fb: FormBuilder,
        private patientService: PatientService,
        private pilotStudiesService: PilotStudyService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private modalService: ModalService,
        private nutritionalQuestionnaireService: NutritionalQuestionnairesService,
        private odontologicalQuestionnaireService: OdontologicalQuestionnairesService,
        private datePipe: DatePipe,
        private sleepPipe: SleepPipe
    ) {
        this.currentDate = new Date();
        this.timeSeriesTypes = Object.keys(TimeSeriesType);
        this.measurementSelected = TimeSeriesType.steps;
        const sleep = new Sleep()
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

        sleep.pattern.summary.asleep = new SleepPatternSummaryData()
        sleep.pattern.summary.asleep.count = 55;
        sleep.pattern.summary.asleep.duration = 28020000;

        sleep.pattern.summary.awake = new SleepPatternSummaryData()
        sleep.pattern.summary.awake.count = 5;
        sleep.pattern.summary.awake.duration = 28020000;

        sleep.pattern.summary.restless = new SleepPatternSummaryData()
        sleep.pattern.summary.restless.count = 40;
        sleep.pattern.summary.restless.duration = 28020000;

        this.sleepSelected = sleep;

        this.caloriesValue = 956;
        this.stepsValue = 1553;
        this.activeMinutesValue = 352;
        this.activeMinutesSettings = false;
        this.distanceValue = 22;
        this.listActivities = [new PhysicalActivity('Run'), new PhysicalActivity('Walk'), new PhysicalActivity('Swim')];
        this.listActivitiesIsEmpty = false;
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.patientService.getById(this.patientId)
                .then(patient => {

                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-FIND'));
                });
        });
        this.loadActivitiesGraph();
        this.loadSleepGraph();
        this.innerWidth = window.innerWidth;
        this.sleepSize = 250;
        this.stepSize = 200;
    }

    loadActivitiesGraph(): void {

        const xAxis = {
            show: false,
            data: []
        };

        const series = {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                color: '#FF7373'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#FFF2F2'
                }, {
                    offset: 1,
                    color: '#FF7373'
                }])
            },
            data: [1, 2, 3, 3, 5, 4, 6, 8, 5, 6, 8, 1, 2, 5, 3, 5, 4, 9, 7, 8, 6, 6, 4, 6, 6]
        };

        const yAxis = {
            show: false,
            min: 0,
            max: 100,
            axisLabel: {
                formatter: function () {
                    return ''
                }
            }
        }
        this.activityGraph = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            graphic: {
                type: 'image',
                id: 'logo',
                left: 5,
                top: 2,
                z: -10,
                bounding: 'raw',
                origin: [0, 0],
                style: {
                    image: 'https://image.flaticon.com/icons/png/512/226/226986.png',
                    width: 25,
                    height: 25,
                    opacity: 0.4
                }
            },
            grid: [
                { x: '0', y: '7%', width: '100%', height: '95%' }
            ],
            xAxis: {
                show: false,
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: ''
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                boundaryGap: [0, '100%']
            },
            series
        }

        this.activityCalorieGraph = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            graphic: {
                type: 'image',
                id: 'logo',
                left: 5,
                top: 2,
                z: -10,
                bounding: 'raw',
                origin: [0, 0],
                style: {
                    image: 'https://image.flaticon.com/icons/png/512/2117/premium/2117139.png',
                    width: 25,
                    height: 25,
                    opacity: 0.7
                }
            },
            grid: [
                { x: '0', y: '7%', width: '100%', height: '95%' }
            ],
            xAxis: {
                show: false,
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    formatter: ''
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                boundaryGap: [0, '100%']
            },
            series: {
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: '#FBA53E'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#FFF2F2'
                    }, {
                        offset: 1,
                        color: '#FBA53E'
                    }])
                },
                data: [72, 72]
            }
        }
    }

    loadSleepGraph(): void {
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
            visualMap: {
                show: false,
                type: 'continuous',
                min: 0,
                max: 3,
                color: ['#ff1012', '#25c5b5', '#0402EC']
            },
            series: [
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
                },
                {
                    type: 'gauge',
                    min: 0,
                    max: 8,
                    center: ['85%', '25%'],
                    radius: '25%',
                    startAngle: 180,
                    endAngle: 0,
                    splitNumber: 1,
                    axisLabel: {
                        color: '#000000',
                        padding: [30, -30, 0, -30],
                        fontSize: 16
                    },
                    axisLine: {
                        lineStyle: {
                            color: [
                                [0.2, '#228b22'],
                                [0.8, '#48b'],
                                [1, '#ff4500']
                            ],
                            width: 8
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        splitNumber: 5,
                        length: 10,        // 属性length控制线长
                        lineStyle: {        // 属性lineStyle控制线条样式
                            color: '#FFFFFF'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 25,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    pointer: {
                        width: 4,
                        length: '90%'
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        show: true
                    },
                    data: [7.5]
                }
            ]
        };


    }

    sleepEnterAndLeave(value: boolean): void {
        this.sleepHover = value;
    }

    stepEnterAndLeave(value: boolean): void {
        this.stepsHover = value;
    }

    activeMinutesEnterAndLeave(value: boolean): void {
        this.activeMinutesHover = value;
    }

    changeSettingsActiveMinutes(): void {
        this.activeMinutesSettings = !this.activeMinutesSettings;
    }

    caloriesEnterAndLeave(value: boolean): void {
        this.caloriesHover = value;
    }

    distanceEnterAndLeave(value: boolean): void {
        this.distanceHover = value;
    }

    trackById(index, item: PhysicalActivity) {
        return item.id
    }
}
