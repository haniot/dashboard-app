import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as echarts from 'echarts'

import { TimeSeriesType } from '../models/time.series';
import { Sleep, SleepPattern, SleepPatternPhaseSummary, SleepPatternSummaryData } from '../models/sleep';
import { PatientService } from '../../patient/services/patient.service';
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service';
import { NutritionalQuestionnairesService } from '../../habits/services/nutritional.questionnaires.service';
import { OdontologicalQuestionnairesService } from '../../habits/services/odontological.questionnaires.service';
import { SleepPipe } from '../pipes/sleep.pipe';
import { PhysicalActivity } from '../models/physical.activity'
import { Goal } from '../../patient/models/goal'
import { Patient } from '../../patient/models/patient'
import { PhysicalActivitiesService } from '../services/physical.activities.service'

@Component({
    selector: 'activity-dashboard',
    templateUrl: './activity.dashboard.component.html',
    styleUrls: ['./activity.dashboard.component.scss']
})
export class ActivityDashboardComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    patient: Patient;
    activityGraph: any
    activityCalorieGraph: any;
    currentDate: Date;
    timeSeriesTypes: any;
    measurementSelected: TimeSeriesType;
    sleepSize: number;
    sleepStages: any;
    sleepSelected: Sleep;
    loadingDashboard: boolean;
    sleepValue: number;
    sleepMax: number;
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
    goal: Goal;
    innerWidth: any;
    listActivities: PhysicalActivity[];
    listActivitiesIsEmpty: boolean;
    Math = Math;
    @ViewChild('sleepDiv', { static: false }) sleepDivRef: ElementRef;
    @ViewChild('stepDiv', { static: false }) stepDivRef: ElementRef;

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.innerWidth = window.innerWidth;
        if (this.sleepDivRef) {
            this.sleepSize = this.sleepDivRef.nativeElement.offsetWidth - (this.sleepDivRef.nativeElement.offsetWidth * 0.27);
        }

        if (this.stepDivRef) {
            this.stepSize = Math.min(this.stepDivRef.nativeElement.offsetWidth, this.stepDivRef.nativeElement.offsetHeight)
                - (Math.min(this.stepDivRef.nativeElement.offsetWidth, this.stepDivRef.nativeElement.offsetHeight) * 0.3);
        }
    }

    constructor(
        private activityService: PhysicalActivitiesService,
        private fb: FormBuilder,
        private patientService: PatientService,
        private pilotStudiesService: PilotStudyService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService
    ) {
        this.currentDate = new Date();
        this.timeSeriesTypes = Object.keys(TimeSeriesType);
        this.measurementSelected = TimeSeriesType.steps;
        this.goal = new Goal();
        const sleep = new Sleep()
        sleep.start_time = '2018-08-18T01:40:30.00Z';
        sleep.end_time = '2018-08-18T09:36:30.00Z';
        sleep.duration = 25520000;
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
        sleep.pattern.summary.awake.duration = 1020000;

        sleep.pattern.summary.restless = new SleepPatternSummaryData()
        sleep.pattern.summary.restless.count = 40;
        sleep.pattern.summary.restless.duration = 28020000;

        this.sleepSelected = sleep;
        this.caloriesValue = 956;
        this.stepsValue = 1000;
        this.activeMinutesValue = 50;
        this.activeMinutesSettings = false;
        this.distanceValue = 22;
        this.sleepValue = Math.floor((sleep.duration / 3600000));
        this.listActivities = [];
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.patientService.getById(this.patientId)
                .then(patient => this.patient = patient)
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-FIND'));
                });
        });
        this.innerWidth = window.innerWidth;
        this.sleepSize = 250;
        this.stepSize = 200;
    }

    loadGoals(): void {
        this.patientService.getGoals(this.patientId)
            .then(goal => {
                this.goal = goal;
                this.sleepMax = Math.floor(this.goal.sleep / 60);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    loadActivities(): void {
        this.activityService.getAll(this.patientId)
            .then(activities => {
                this.listActivities = activities
                this.listActivitiesIsEmpty = this.listActivities.length === 0;
            })
            .catch(err => {
                console.log(err)
            })
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

    sleepEnterAndLeave(value: boolean): void {
        this.sleepHover = value;
    }

    stepEnterAndLeave(value: boolean): void {
        this.stepsHover = value;
    }

    activeMinutesEnterAndLeave(value: boolean): void {
        this.activeMinutesHover = value;
    }

    caloriesEnterAndLeave(value: boolean): void {
        this.caloriesHover = value;
    }

    distanceEnterAndLeave(value: boolean): void {
        this.distanceHover = value;
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    }

    trackById(index, item: PhysicalActivity) {
        return item.id
    }

    previosDay(): void {
        this.loadingDashboard = true;
        setTimeout(() => {
            this.loadingDashboard = false;
        }, 2000)
        this.currentDate = new Date(this.currentDate.getTime() - (24 * 60 * 60 * 1000));
    }

    nextDay(): void {
        if (!this.isToday(this.currentDate)) {
            this.loadingDashboard = true;
            setTimeout(() => {
                this.loadingDashboard = false;
            }, 2000)
            this.currentDate = new Date(this.currentDate.getTime() + (24 * 60 * 60 * 1000));
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.patientId.currentValue && (changes.patientId.currentValue !== changes.patientId.previousValue)) {
            this.loadGoals();
            this.loadActivitiesGraph();
            this.loadActivities();
            // this.loadSleepGraph();
        }
    }
}
