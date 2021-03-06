import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as echarts from 'echarts'

import {
    defaultIntervalIntraday,
    Intervals,
    TimeSeriesFullFilter,
    TimeSeriesIntervalFilter,
    TimeSeriesSimpleFilter,
    TimeSeriesType
} from '../models/time.series';
import { Sleep } from '../models/sleep';
import { PatientService } from '../../patient/services/patient.service';
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { PhysicalActivity } from '../models/physical.activity';
import { Goal } from '../../patient/models/goal';
import { Patient } from '../../patient/models/patient';
import { PhysicalActivitiesService } from '../services/physical.activities.service';
import { TimeSeriesService } from '../services/time.series.service';
import { SleepFilter, SleepService } from '../services/sleep.service';
import { VerifyScopeService } from '../../../security/services/verify.scope.service';
import { AccessStatus, SynchronizeData } from '../../patient/models/external.service';
import { FitbitService } from '../../../security/external.services/services/fitbit.service';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service';

@Component({
    selector: 'activity-dashboard',
    templateUrl: './activity.dashboard.component.html',
    styleUrls: ['./activity.dashboard.component.scss']
})
export class ActivityDashboardComponent implements OnInit, OnChanges {
    readonly today: Date = new Date()
    @Input() patientId: string;
    patient: Patient;
    activityGraph: any[];
    currentDate: Date;
    timeSeriesTypes: any;
    measurementSelected: TimeSeriesType;
    sleepSize: number;
    sleepSelected: Sleep;
    loadingTimeSeries: boolean;
    loadingSleep: boolean;
    sleepValue: number;
    sleepMax: number;
    sleepHover: boolean;
    stepsHover: boolean;
    stepsValue: number;
    stepSize: number;
    caloriesHover: boolean;
    caloriesValue: number;
    caloriesSize: number;
    activeMinutesHover: boolean;
    activeMinutesValue: number;
    activeMinutesSize: number;
    distanceHover: boolean;
    distanceValue: number;
    distanceSize: number;
    goal: Goal;
    innerWidth: any;
    listActivities: PhysicalActivity[];
    listActivitiesIsEmpty: boolean;
    Math = Math;
    currentFilter: TimeSeriesIntervalFilter;
    sleepDivRef: ElementRef;
    visibilityFitBitSync: boolean;
    synchronizing: boolean;
    synchronizeData: SynchronizeData;
    AccessStatus = AccessStatus;

    @ViewChild('sleepDiv')
    set sleepDiv(element: ElementRef) {
        if (element) {
            setTimeout(() => {
                this.sleepDivRef = element;
                this.sleepSize = this.sleepDivRef ? Math.min(this.sleepDivRef.nativeElement.offsetWidth * 0.9, 250) : 250;
            })
        }
    };

    stepDivRef: ElementRef;

    @ViewChild('stepsDiv')
    set stepsDiv(element: ElementRef) {
        if (element) {
            setTimeout(() => {
                this.stepDivRef = element;
                this.stepSize = this.stepDivRef ? Math.min(this.stepDivRef.nativeElement.offsetWidth * 0.9, 200) : 200;
            })
        }
    };

    caloriesCardRef: ElementRef;

    @ViewChild('caloriesDiv')
    set caloriesDiv(element: ElementRef) {
        if (element) {
            setTimeout(() => {
                this.caloriesCardRef = element;
                this.caloriesSize = this.caloriesCardRef ? Math.min(this.caloriesCardRef.nativeElement.offsetWidth * 0.9, 200) : 200;
            })
        }
    };

    distanceCardRef: ElementRef;

    @ViewChild('distanceDiv')
    set distanceDiv(element: ElementRef) {
        setTimeout(() => {
            this.distanceCardRef = element;
            this.distanceSize = this.distanceCardRef ? Math.min(this.distanceCardRef.nativeElement.offsetWidth * 0.9, 200) : 200;
        })
    };

    activeMinutesCardRef: ElementRef;

    @ViewChild('activeMinutesDiv')
    set activeMinutesDiv(element: ElementRef) {
        if (element) {
            setTimeout(() => {
                this.activeMinutesCardRef = element;
                this.activeMinutesSize =
                    this.activeMinutesCardRef ? Math.min(this.activeMinutesCardRef.nativeElement.offsetWidth * 0.9, 200) : 200;
            })
        }
    };

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.innerWidth = window.innerWidth;
        if (this.sleepDivRef) {
            this.sleepSize = Math.min(this.sleepDivRef.nativeElement.offsetWidth * 0.9, 250);
        }

        if (this.stepDivRef) {
            this.stepSize = Math.min(this.stepDivRef.nativeElement.offsetWidth * 0.9, 200);
        }

        if (this.caloriesCardRef) {
            this.caloriesSize = Math.min(this.caloriesCardRef.nativeElement.offsetWidth * 0.9, 200);
        }

        if (this.activeMinutesCardRef) {
            this.activeMinutesSize = Math.min(this.activeMinutesCardRef.nativeElement.offsetWidth * 0.9, 200);
        }

        if (this.distanceCardRef) {
            this.distanceSize = Math.min(this.distanceCardRef.nativeElement.offsetWidth * 0.9, 200);
        }

    }

    constructor(
        private activityService: PhysicalActivitiesService,
        private sleepService: SleepService,
        private fb: FormBuilder,
        private patientService: PatientService,
        private pilotStudiesService: PilotStudyService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService,
        private timeSeriesService: TimeSeriesService,
        private verifyScopeService: VerifyScopeService,
        private fitbitService: FitbitService,
        private modalService: ModalService,
        private datePipe: DatePipe
    ) {
        this.currentDate = new Date();
        this.activityGraph = new Array(3);
        this.timeSeriesTypes = Object.keys(TimeSeriesType);
        this.measurementSelected = TimeSeriesType.steps;
        this.loadingTimeSeries = true;
        this.listActivities = [];
        this.currentFilter = new TimeSeriesIntervalFilter();
        this.currentFilter.date = this.currentDate.toISOString().split('T')[0];
        this.currentFilter.interval = defaultIntervalIntraday;
        this.sleepSize = 250;
        this.stepSize = 200;
        this.caloriesSize = 200;
        this.distanceSize = 200;
        this.activeMinutesSize = 200;
        this.synchronizeData = new SynchronizeData();
    }

    ngOnInit() {
        this.innerWidth = window.innerWidth;
        this.activeRouter.params.subscribe((params) => {
            this.getQueryParams();
            this.getPatientSelected();
            this.verifyScopes();
        });
    }

    getQueryParams(): void {
        const { date } = this.activeRouter.snapshot.queryParams;
        if (date) {
            const timeZoneOffset = new Date().getTimezoneOffset();

            const dateSelected = timeZoneOffset ? new Date(`${date}T0${timeZoneOffset / 60}:00:00Z`) : new Date(`${date}T00:00:00Z`);
            this.currentDate = dateSelected.getTime() <= new Date().getTime() ? dateSelected : new Date();
            this.currentFilter.date = this.currentDate.toISOString().split('T')[0];
            this.currentFilter.interval = defaultIntervalIntraday;
            this.updateQueryParams();
        }
    }

    getPatientSelected(): void {
        const interval = setInterval(() => {
            const patientSelected = JSON.parse(this.localStorageService.getItem('patientSelected'));
            if (patientSelected && patientSelected.id === this.patientId) {
                this.patient = patientSelected
                clearInterval(interval);
            }
        }, 1500);
    }

    loadGoals(): void {
        this.patientService.getGoals(this.patientId)
            .then(goal => {
                this.goal = goal;
                this.sleepMax = Math.floor(this.goal.sleep / 60);
            })
            .catch((err) => {
                this.goal = new Goal();
            })
    }

    loadActivities(): void {
        this.listActivitiesIsEmpty = false;
        this.activityService.getAll(this.patientId, 1, 3)
            .then(httpResponse => {
                this.listActivities = httpResponse.body
                this.listActivitiesIsEmpty = this.listActivities.length === 0;
                this.loadActivitiesGraph();
            })
            .catch(() => {
                this.listActivitiesIsEmpty = this.listActivities.length === 0;
            })
    }

    loadSleep(): void {
        this.loadingSleep = true;
        const start_time = this.currentDate.toISOString().split('T')[0];
        const nextday: Date = new Date(this.currentDate.getTime() + (24 * 60 * 60 * 1000));
        const end_time = nextday.toISOString().split('T')[0];
        const filter = new SleepFilter('today', start_time, end_time);
        this.sleepService.getAll(this.patientId, 1, 1, filter)
            .then(httpResponse => {
                this.sleepSelected = httpResponse && httpResponse.body ? httpResponse.body[0] : undefined;
                if (this.sleepSelected) {
                    this.sleepValue = (this.sleepSelected.duration / 3600000)
                }
                this.loadingSleep = false;
            })
            .catch(err => {
                this.loadingSleep = false;
            })
    }

    loadTimeSeries(): void {
        this.loadingTimeSeries = true;
        const filter: TimeSeriesSimpleFilter = new TimeSeriesSimpleFilter();
        filter.start_date = this.currentDate.toISOString().split('T')[0];
        filter.end_date = this.currentDate.toISOString().split('T')[0];
        this.timeSeriesService.getAll(this.patientId, filter)
            .then((timeSeries: any) => {
                this.stepsValue = timeSeries.steps.summary.total;
                this.caloriesValue = timeSeries.calories.summary.total;
                this.activeMinutesValue = timeSeries.active_minutes.summary.total;
                this.distanceValue = timeSeries.distance.summary.total;
                this.loadingTimeSeries = false;
            })
            .catch(err => {
                this.stepsValue = 0;
                this.caloriesValue = 0;
                this.activeMinutesValue = 0;
                this.distanceValue = 0;
                this.loadingTimeSeries = false;
            });
    }

    loadActivitiesGraph(): void {
        this.listActivities.forEach((activity, index) => {
            if (activity.heart_rate_average) {
                this.insertHeartRateGraph(activity, index);
            } else {
                this.insertCaloriesGraph(activity, index);
            }
        })
    }

    insertCaloriesGraph(activity: PhysicalActivity, index: number): void {
        const start_zone = activity.start_time.split('.')[1]
        const start_date = new Date(this.datePipe.transform(activity.start_time, 'shortDate', start_zone, 'en-us'));
        const end_zone = activity.end_time.split('.')[1]
        const end_date = new Date(this.datePipe.transform(activity.end_time, 'shortDate', end_zone, 'en-us'));
        const filter = new TimeSeriesFullFilter();
        filter.start_date = start_date.toISOString().split('T')[0];
        filter.end_date = end_date.toISOString().split('T')[0];
        filter.start_time = this.datePipe.transform(activity.start_time, 'HH:mm:ss');
        filter.end_time = this.datePipe.transform(activity.end_time, 'HH:mm:ss');
        filter.interval = Intervals._1s;
        this.timeSeriesService.getWithResourceAndTime(this.patientId, TimeSeriesType.calories, filter)
            .then(calories => {
                const series = {
                    type: 'line',
                    symbol: 'none',
                    sampling: 'average',
                    step: true,
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
                    data: calories.data_set.map((elementCalorie) => {
                        return elementCalorie.value;
                    })
                };

                const total = calories.data_set.reduce((previous, current) => {
                    return previous + current.value;
                }, 0);

                this.activityGraph[index] = {
                    title: {
                        show: !series.data || !series.data.length || !total,
                        text: this.translateService.instant('ACTIVITY.PHYSICAL-ACTIVITY.TIME-SERIES-UNAVAILABLE'),
                        top: 'center',
                        left: 'center',
                        textStyle: {
                            fontSize: 12
                        }
                    },
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
                    series
                }
            });
    }

    insertHeartRateGraph(activity: PhysicalActivity, index: number): void {
        const start_zone = activity.start_time.split('.')[1]
        const start_date = new Date(this.datePipe.transform(activity.start_time, 'shortDate', start_zone, 'en-us'));
        const end_zone = activity.end_time.split('.')[1]
        const end_date = new Date(this.datePipe.transform(activity.end_time, 'shortDate', end_zone, 'en-us'));
        const filter = new TimeSeriesFullFilter();
        filter.start_date = start_date.toISOString().split('T')[0];
        filter.end_date = end_date.toISOString().split('T')[0];
        filter.start_time = this.datePipe.transform(activity.start_time, 'HH:mm:ss');
        filter.end_time = this.datePipe.transform(activity.end_time, 'HH:mm:ss');
        filter.interval = Intervals._1s;
        this.timeSeriesService.getWithResourceAndTime(this.patientId, TimeSeriesType.heart_rate, filter)
            .then(heartRate => {

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
                    data: heartRate.data_set.map((elementHeart) => {
                        return elementHeart.value;
                    })
                };

                this.activityGraph[index] = {
                    title: {
                        show: !series.data || !series.data.length,
                        text: this.translateService.instant('ACTIVITY.PHYSICAL-ACTIVITY.TIME-SERIES-UNAVAILABLE'),
                        top: 'center',
                        left: 'center',
                        textStyle: {
                            fontSize: 12
                        }
                    },
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
                };

            });
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

    previousDate(): void {
        this.currentDate = new Date(this.currentDate.getTime() - (24 * 60 * 60 * 1000));
        this.currentFilter.date = this.currentDate.toISOString().split('T')[0];
        this.loadTimeSeries();
        this.loadSleep();
        this.updateQueryParams();
        // this.loadActivities();
    }

    nextDate(): void {
        if (!this.isToday(this.currentDate)) {
            this.currentDate = new Date(this.currentDate.getTime() + (24 * 60 * 60 * 1000));
            this.currentFilter.date = this.currentDate.toISOString().split('T')[0];
            this.loadTimeSeries();
            this.loadSleep();
            this.updateQueryParams();
        }
    }

    updateQueryParams(): void {
        const date = this.currentDate.toISOString().split('T')[0];
        const queryParams: Params = { date };
        this.router.navigate(
            [],
            {
                relativeTo: this.activeRouter,
                queryParams: queryParams
            });
    }

    changeDate(): void {
        this.loadGoals();
        this.loadActivities();
        this.loadTimeSeries();
        this.loadSleep();
        this.updateQueryParams();
    }

    async synchronize(): Promise<void> {
        this.synchronizing = true;
        try {
            this.synchronizeData = await this.fitbitService.synchronize(this.patientId);
            this.currentDate = new Date();
            this.loadGoals();
            this.loadActivities();
            this.loadTimeSeries();
            this.loadSleep();
            this.modalService.open('synchronized');
        } catch (err) {
            if (err && err.status === 429) {
                this.toastService.error(this.translateService.instant('SECURITY.FORGOT.TOO-MANY-ATTEMPTS'))
            } else {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.COULD-NOT-SYNC'))
            }
        } finally {
            this.synchronizing = false;
        }
    }

    closeModalSynchronized(): void {
        this.modalService.close('synchronized');
    }

    verifyScopes(): void {
        this.visibilityFitBitSync = this.verifyScopeService.verifyScopes(['external:sync']);
    }

    stopPropagation(event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.patientId.currentValue && (changes.patientId.currentValue !== changes.patientId.previousValue)) {
            this.getQueryParams();
            this.loadGoals();
            this.loadActivities();
            this.loadTimeSeries();
            this.loadSleep();
        }
    }
}
