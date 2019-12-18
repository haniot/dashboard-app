import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts'
import { PageEvent } from '@angular/material'

import { PatientService } from '../services/patient.service';
import { Gender, Patient } from '../models/patient';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { NutritionalQuestionnaire } from '../../habits/models/nutritional.questionnaire'
import { NutritionalQuestionnairesService } from '../../habits/services/nutritional.questionnaires.service'
import { OdontologicalQuestionnaire } from '../../habits/models/odontological.questionnaire'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { OdontologicalQuestionnairesService } from '../../habits/services/odontological.questionnaires.service'
import { ConfigurationBasic } from '../../config.matpaginator'
import { PilotStudy } from '../../pilot.study/models/pilot.study'
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service'
import { TimeSeriesType } from '../../activity/models/time.series'
import { DatePipe } from '@angular/common'
import { SleepPipe } from '../../activity/pipes/sleep.pipe'
import { Sleep, SleepPattern, SleepPatternSummaryData } from '../../activity/models/sleep'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-view-habits',
    templateUrl: './view.habits.component.html',
    styleUrls: ['./view.habits.component.scss']
})
export class ViewHabitsComponent implements OnInit, OnDestroy {
    patientForm: FormGroup;
    pilotStudy: PilotStudy;
    patientId: string;
    showMeasurements: boolean;
    showLogMeasurements: boolean;
    configVisibility = {
        weight: true,
        height: false,
        fat: false,
        circumference: false,
        temperature: false,
        glucose: false,
        pressure: false,
        heartRate: false
    };
    private subscriptions: Array<ISubscription>;
    nutritionalQuestionnaire: NutritionalQuestionnaire;
    odontologicalQuestionnaire: OdontologicalQuestionnaire;
    nutritionalQuestionnaireOptions: {
        page: number, limit: number, pageSizeOptions: number[], length: number, pageEvent: PageEvent
    };
    odontologicalQuestionnaireOptions: {
        page: number, limit: number, pageSizeOptions: number[], length: number, pageEvent: PageEvent
    };
    removingQuestionnaire: boolean;
    loadingNutritionalQuestionnaire: boolean;
    loadingOdontologicalQuestionnaire: boolean;
    associatedStudies: Array<PilotStudy>;
    fadeInNutritioalQuestionnaire: string;
    fadeInOdontologicalQuestionnaire: string;
    activityGraph: any
    activityCalorieGraph: any;
    currentDate: Date;
    timeSeriesTypes: any;
    measurementSelected: TimeSeriesType;
    sleepStages: any;
    sleepSelected: Sleep;
    sleepHover: boolean;
    stepsHover: boolean;
    stepsValue: number;
    caloriesHover: boolean;
    caloriesValue: number;
    activeMinutesHover: boolean;
    activeMinutesValue: number;
    activeMinutesSettings: boolean;
    distanceHover: boolean;
    distanceValue: number;

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
        this.subscriptions = new Array<ISubscription>();
        this.showMeasurements = false;
        this.showLogMeasurements = false;
        this.nutritionalQuestionnaire = new NutritionalQuestionnaire();
        this.odontologicalQuestionnaire = new OdontologicalQuestionnaire();
        this.nutritionalQuestionnaireOptions = {
            page: PaginatorConfig.page,
            pageSizeOptions: PaginatorConfig.pageSizeOptions,
            limit: 1,
            length: 0,
            pageEvent: undefined
        };
        this.odontologicalQuestionnaireOptions = {
            page: PaginatorConfig.page,
            pageSizeOptions: PaginatorConfig.pageSizeOptions,
            limit: 1,
            length: 0,
            pageEvent: undefined
        };
        this.removingQuestionnaire = false;
        this.loadingNutritionalQuestionnaire = true;
        this.loadingOdontologicalQuestionnaire = true;
        this.pilotStudy = new PilotStudy();
        this.associatedStudies = new Array<PilotStudy>();
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
    }


    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.patientService.getById(this.patientId)
                .then(patient => {
                    this.createPatientForm(patient);
                    this.getQuestionnaires();
                    this.getAssociateStudies();
                })
                .catch(errorResponse => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-FIND'));
                });
        }));
        this.createPatientFormInit();
        this.loadActivitiesGraph();
        this.loadSleepGraph();
    }

    createPatientFormInit() {
        this.patientForm = this.fb.group({
            id: [''],
            created_at: [''],
            selected_pilot_study: [{ value: '', disabled: true }],
            name: [{ value: '', disabled: true }],
            email: [{ value: '', disabled: true }],
            phone_number: [{ value: '', disabled: true }],
            gender: [{ value: '', disabled: true }],
            birth_date: [{ value: '', disabled: true }],
            last_login: [{ value: '', disabled: true }]
            // last_sync: [{ value: '', disabled: true }]
        });
    }

    createPatientForm(patient: Patient) {
        this.patientForm = this.fb.group({
            id: [patient.id],
            created_at: [patient.created_at],
            selected_pilot_study: [patient.selected_pilot_study],
            name: [{ value: patient.name, disabled: true }],
            email: [{ value: patient.email, disabled: true }],
            phone_number: [{ value: patient.phone_number, disabled: true }],
            gender: [{ value: patient.gender, disabled: true }],
            birth_date: [{ value: patient.birth_date, disabled: true }],
            last_login: [{ value: patient.last_login, disabled: true }]
            // last_sync: [{ value: patient.last_sync, disabled: true }]
        });
    }

    getAssociateStudies() {
        const patientId = this.patientForm.get('id').value;
        this.patientService.getAllByPatientId(patientId)
            .then(httpResponse => {
                this.associatedStudies = httpResponse.body;
            })
            .catch(() => {
            });
    }

    openModalConfirmationRemoveNutritionalQuestionnaire(): void {
        this.modalService.open('confirmationRemoveNutritionalQuestionnaire');
    }

    closeModalConfirmationNutritionalQuestionnaire(): void {
        this.modalService.close('confirmationRemoveNutritionalQuestionnaire');
    }

    nutritionalQuestionnairePageEvent(pageEvent: PageEvent): void {
        this.loadingNutritionalQuestionnaire = true;
        /* + 1 because pageIndex starts at 0*/
        this.nutritionalQuestionnaireOptions.page = pageEvent.pageIndex + 1;
        this.nutritionalQuestionnaireOptions.limit = pageEvent.pageSize;
        this.getAllNutritionalQuestionnaires();
    }

    getAllNutritionalQuestionnaires(): void {
        this.nutritionalQuestionnaireService
            .getAll(this.patientId, this.nutritionalQuestionnaireOptions.page, this.nutritionalQuestionnaireOptions.limit)
            .then(httpResponse => {
                this.nutritionalQuestionnaire = new NutritionalQuestionnaire();
                this.nutritionalQuestionnaireOptions.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    const nutritionalQuestionnaires = httpResponse.body;
                    this.nutritionalQuestionnaire = nutritionalQuestionnaires[0];
                    this.fadeInNutritioalQuestionnaire = 'fadeIn';
                    this.cleanFadeIn();
                }
                this.loadingNutritionalQuestionnaire = false;
            })
            .catch(() => {
                this.loadingNutritionalQuestionnaire = false;
            })
    }

    removeNutritionalQuestionnaires(): void {
        this.removingQuestionnaire = true;
        this.closeModalConfirmationNutritionalQuestionnaire();
        this.nutritionalQuestionnaireService
            .remove(this.patientId, this.nutritionalQuestionnaire.id)
            .then(() => {
                this.getAllNutritionalQuestionnaires();
                this.removingQuestionnaire = false;
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-DELETED'));
            })
            .catch((errorResponse => {
                this.removingQuestionnaire = false;

                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-NOT-DELETED'));
            }))
    }

    openModalConfirmationRemoveOdontologicalQuestionnaire(): void {
        this.modalService.open('confirmationRemoveOdontologicalQuestionnaire');
    }

    closeModalConfirmationOdontologicalQuestionnaire(): void {
        this.modalService.close('confirmationRemoveOdontologicalQuestionnaire');
    }

    odontologicalQuestionnairePageEvent(pageEvent: PageEvent): void {
        this.loadingOdontologicalQuestionnaire = true;
        /* + 1 because pageIndex starts at 0*/
        this.odontologicalQuestionnaireOptions.page = pageEvent.pageIndex + 1;
        this.odontologicalQuestionnaireOptions.limit = pageEvent.pageSize;
        this.getAllOdontologicalQuestionnaires();
    }

    getAllOdontologicalQuestionnaires(): void {
        this.odontologicalQuestionnaireService
            .getAll(this.patientId, this.odontologicalQuestionnaireOptions.page, this.odontologicalQuestionnaireOptions.limit)
            .then(httpResponse => {
                this.odontologicalQuestionnaire = new OdontologicalQuestionnaire();
                this.odontologicalQuestionnaireOptions.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    const odontologicalQuestionnaires = httpResponse.body;
                    this.odontologicalQuestionnaire = odontologicalQuestionnaires[0];
                    this.fadeInOdontologicalQuestionnaire = 'fadeIn';
                    this.cleanFadeIn();
                }
                this.loadingOdontologicalQuestionnaire = false;
            })
            .catch(() => {
                this.loadingOdontologicalQuestionnaire = false;
            })
    }

    removeOdontologicalQuestionnaires(): void {
        this.removingQuestionnaire = true;
        this.closeModalConfirmationOdontologicalQuestionnaire();
        this.odontologicalQuestionnaireService
            .remove(this.patientId, this.odontologicalQuestionnaire.id)
            .then(() => {
                this.getAllOdontologicalQuestionnaires();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-DELETED'));
                this.removingQuestionnaire = false;
            })
            .catch((() => {
                this.removingQuestionnaire = false;
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.QUESTIONNAIRE-NOT-DELETED'));
            }))
    }

    clickOnMatTab(event) {
        switch (event.index) {
            case 2:
                this.showMeasurements = true;
                break;
            case 3:
                this.showLogMeasurements = true;
                break;
        }
        // if (this.userHealthArea === 'dentistry' || this.userHealthArea === 'admin') {
        //
        // } else {
        //     switch (event.index) {
        //         case 1:
        //             this.showMeasurements = true;
        //             break;
        //         case 2:
        //             this.showLogMeasurements = true;
        //             break;
        //     }
        // }
    }

    cleanFadeIn(): void {
        setTimeout(() => {
            this.fadeInNutritioalQuestionnaire = '';
            this.fadeInOdontologicalQuestionnaire = '';
        }, 1000);
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    loadActivitiesGraph(): void {

        const xAxis = {
            show: false,
            data: []
        };

        // const series = [
        //     {
        //         type: 'bar',
        //         barMaxWidth: 48,
        //         itemStyle: {
        //             normal: { color: 'rgba(0,0,0,0.05)' }
        //         },
        //         barGap: '-100%',
        //         barCategoryGap: '40%',
        //         data: [100],
        //         animation: false
        //     },
        //     {
        //         type: 'bar',
        //         barMaxWidth: 50,
        //         label: {
        //             show: true,
        //             color: '#979594',
        //             position: 'top',
        //             verticalAlign: 'middle',
        //             rotate: 0,
        //             formatter: function (params) {
        //                 return params.value
        //             },
        //             fontSize: 16
        //         },
        //         itemStyle: {
        //             normal: {
        //                 color: new echarts.graphic.LinearGradient(
        //                     0, 0, 0, 1,
        //                     [
        //                         { offset: 0, color: '#ffb45f' },
        //                         { offset: 0.5, color: '#ffd16c' },
        //                         { offset: 1, color: '#ffb45f' }
        //                     ]
        //                 )
        //             },
        //             emphasis: {
        //                 color: new echarts.graphic.LinearGradient(
        //                     0, 0, 0, 1,
        //                     [
        //                         { offset: 0, color: '#ffb45f' },
        //                         { offset: 0.7, color: '#ffd16c' },
        //                         { offset: 1, color: '#ffb45f' }
        //                     ]
        //                 )
        //             }
        //         },
        //         data: [72]
        //     }
        // ];

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

    getQuestionnaires(): void {
        this.getAllNutritionalQuestionnaires();
        this.getAllOdontologicalQuestionnaires();
    }

}
