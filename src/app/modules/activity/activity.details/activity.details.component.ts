import { Component, OnInit } from '@angular/core';
import { PhysicalActivity } from '../models/physical.activity'
import { TimeSeries, TimeSeriesItem, TimeSeriesSimpleFilter } from '../models/time.series'
import { TranslateService } from '@ngx-translate/core'
import { DatePipe } from '@angular/common'
import { ActivityLevel, Levels } from '../models/activity'
import { MillisecondPipe } from '../pipes/millisecond.pipe'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { PhysicalActivitiesService } from '../services/physical.activities.service'
import { ActivatedRoute, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { TimeSeriesService } from '../services/time.series.service'

@Component({
    selector: 'activity.details',
    templateUrl: './activity.details.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './activity.details.component.scss']
})
export class ActivityDetailsComponent implements OnInit {
    patientId: string;
    physicalActivity: PhysicalActivity;
    cacheIdForRemove: string;
    intensityLevelsGraph: any;
    heartRateGraph: any;
    Math = Math;
    removingActivity: boolean;
    loadingPhysicalActivity: boolean;
    stepsValue: number;
    caloriesValue: number;
    activeMinutesValue: number;
    distanceValue: number;
    impactOfSteps: number;
    impactOfCalories: number;
    impactOfActiveMinutes: number;

    constructor(
        private activeRouter: ActivatedRoute,
        private datePipe: DatePipe,
        private millisecondPipe: MillisecondPipe,
        private translateService: TranslateService,
        private modalService: ModalService,
        private physicalActivitiesService: PhysicalActivitiesService,
        private timeSeriesService: TimeSeriesService,
        private router: Router,
        private toastService: ToastrService) {
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            const activityId = params.get('activityId');
            this.loadActivity(activityId);
        })
    }

    calcImpact(): void {
        this.impactOfSteps = Math.min(Math.floor((this.physicalActivity.steps * 100) / this.stepsValue), 100);
        this.impactOfCalories = Math.min(Math.floor((this.physicalActivity.calories * 100) / this.caloriesValue), 100);
        this.impactOfActiveMinutes = Math.min(Math.floor(((this.physicalActivity.duration / 60000) * 100) / this.activeMinutesValue));
    }

    loadActivity(activityId: string): void {
        this.loadingPhysicalActivity = true;
        this.physicalActivitiesService.getById(this.patientId, activityId)
            .then(physicalActivity => {
                this.loadingPhysicalActivity = false;
                this.physicalActivity = physicalActivity;
                this.loadTimeSeries();
                this.loadIntensityLevelsGraph();
                this.loadHeartRate();
            })
            .catch(err => {
                this.router.navigate(['/app/activities', this.patientId, 'physical_activity']);
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-NOT-LOADED'))
                this.loadingPhysicalActivity = false;
            })
    }

    loadIntensityLevelsGraph(): void {

        const level = this.translateService.instant('ACTIVITY.LEVEL');
        const percent = this.translateService.instant('ACTIVITY.PERCENT');
        const duration = this.translateService.instant('ACTIVITY.SLEEP.DURATION');

        const sedentary = this.translateService.instant('ACTIVITY.PIPES.ACTIVITY-LEVEL.SEDENTARY');
        const light = this.translateService.instant('ACTIVITY.PIPES.ACTIVITY-LEVEL.LIGHT');
        const fairly = this.translateService.instant('ACTIVITY.PIPES.ACTIVITY-LEVEL.FAIRLY');
        const very = this.translateService.instant('ACTIVITY.PIPES.ACTIVITY-LEVEL.VERY');

        const startTimes = this.datePipe.transform(this.physicalActivity.start_time, 'shortTime').split(':')
        const endTimes = this.datePipe.transform(this.physicalActivity.end_time, 'shortTime').split(':')

        const sedentaryData = this.physicalActivity.levels.filter((element: ActivityLevel) => {
            return element.name === Levels.sedentary
        })

        const lightData = this.physicalActivity.levels.filter((element: ActivityLevel) => {
            return element.name === Levels.lightly
        })

        const fairlyData = this.physicalActivity.levels.filter((element: ActivityLevel) => {
            return element.name === Levels.fairly
        })

        const veryData = this.physicalActivity.levels.filter((element: ActivityLevel) => {
            return element.name === Levels.very
        })

        this.intensityLevelsGraph = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return `${params.marker}<br>` +
                        `${level}: ${params.data.name}<br>` +
                        `${duration}: ${params.data.duration}<br>${percent}: ${params.percent}%`
                }
            },
            // grid: [
            //     { x: '7%', y: '7%', width: '90%', height: '90%' }
            // ],
            legend: {
                orient: 'horizontal',
                selected: {
                    [sedentary]: !!sedentaryData[0].duration,
                    [light]: !!lightData[0].duration,
                    [fairly]: !!fairlyData[0].duration,
                    [very]: !!veryData[0].duration
                },
                data: [{ name: sedentary }, { name: light }, { name: fairly }, { name: very }]
            },
            series: {
                type: 'pie',
                radius: '55%',
                data: [
                    {
                        value: sedentaryData && sedentaryData.length ? sedentaryData[0].duration : 0,
                        name: sedentary,
                        duration: this.millisecondPipe.transform(sedentaryData && sedentaryData.length ? sedentaryData[0].duration : 0)
                    },
                    {
                        value: lightData && lightData.length ? lightData[0].duration : 0,
                        name: light,
                        duration: this.millisecondPipe.transform(lightData && lightData.length ? lightData[0].duration : 0)
                    },
                    {
                        value: fairlyData && fairlyData.length ? fairlyData[0].duration : 0,
                        name: fairly,
                        duration: this.millisecondPipe.transform(fairlyData && fairlyData.length ? fairlyData[0].duration : 0)
                    },
                    {
                        value: veryData && veryData.length ? veryData[0].duration : 0,
                        name: very,
                        duration: this.millisecondPipe.transform(veryData && veryData.length ? veryData[0].duration : 0)
                    }],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        }

    }

    loadHeartRate(): void {
        if (this.physicalActivity && this.physicalActivity.heart_rate_link) {
            this.timeSeriesService.getByLink(this.physicalActivity.heart_rate_link)
                .then(resource => {
                    this.loadHeartRateGraph(resource);
                })
                .catch(() => {

                })
        }
    }

    loadHeartRateGraph(resource: TimeSeries) {
        const frequency = this.translateService.instant('TIME-SERIES.HEART-RATE.FREQUENCY');

        const dateAndHour = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');

        const low = this.translateService.instant('TIME-SERIES.HEART-RATE.LOW');
        const normal = this.translateService.instant('TIME-SERIES.HEART-RATE.NORMAL');
        const high = this.translateService.instant('TIME-SERIES.HEART-RATE.HIGH');
        const upperLimit = this.translateService.instant('SHARED.UPPER-LIMIT');
        const classification = this.translateService.instant('SHARED.CLASSIFICATION');

        const xAxisOptionsLastDate = { data: [] };

        const seriesOptionsLastDate = {
            type: 'line',
            data: [],
            color: '#7F7F7F',
            lineStyle: {
                normal: {
                    width: 4
                }
            },
            markLine: {
                silent: false,
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        try {
                            const { data: { label: { formatter } }, value } = params
                            return `${upperLimit}: ${value}bpm<br>${classification}: ${formatter}`;
                        } catch (e) {
                        }
                    }
                },
                data: [{
                    label: {
                        formatter: low
                    },
                    yAxis: 50
                }, {
                    label: {
                        formatter: normal
                    },
                    yAxis: 100
                }, {
                    label: {
                        formatter: high
                    },
                    yAxis: 200
                }]
            },
            markPoint: {
                label: {
                    color: '#FFFFFF',
                    fontSize: 10,
                    formatter: function (params) {
                        if (params.data.type === 'max') {
                            return max;
                        }
                        if (params.data.type === 'min') {
                            return min;
                        }
                    }
                },
                data: [
                    { type: 'max' },
                    { type: 'min' }
                ]
            }
        };


        if (resource && resource.data_set) {
            resource.data_set.forEach((heartRate: TimeSeriesItem) => {
                xAxisOptionsLastDate.data.push(this.datePipe.transform(heartRate.date, 'shortDate'));
                seriesOptionsLastDate.data.push({
                    value: heartRate.value,
                    time: this.datePipe.transform(heartRate.date, 'mediumTime'),
                    date: this.datePipe.transform(heartRate.date, 'shortDate')
                });
            });
        }

        this.heartRateGraph = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params[0].data.type === 'max' || params[0].data.type === 'min') {
                        const t = seriesOptionsLastDate.data.find(currenHeartRate => {
                            return currenHeartRate.value === params[0].value;
                        });
                        if (t) {
                            return `${frequency} : ${t.value} bpm <br> ${dateAndHour}: <br> ${t.date} ${at} ${t.time}`
                        }

                    }
                    const { value, date, time } = params[0].data
                    return `${frequency} : ${value} bpm <br> ${dateAndHour}: <br> ${date} ${at} ${time}`
                }
            },
            xAxis: xAxisOptionsLastDate,
            yAxis: {
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} bpm'
                },
                min: 0,
                max: 200
            },
            visualMap: {
                orient: 'horizontal',
                top: 20,
                right: 0,
                pieces: [{
                    gt: 0,
                    lte: 50,
                    label: low,
                    color: '#236399'
                }, {
                    gt: 50,
                    lte: 100,
                    label: normal,
                    color: '#ffde33'
                }, {
                    gt: 100,
                    label: high,
                    color: '#7e0023'
                }],
                outOfRange: {
                    color: '#999'
                }
            },
            series: seriesOptionsLastDate
        };

    }

    loadTimeSeries(): void {
        const currentDate = new Date(this.physicalActivity.start_time);
        const filter: TimeSeriesSimpleFilter = new TimeSeriesSimpleFilter();
        filter.start_date = currentDate.toISOString().split('T')[0];
        filter.end_date = currentDate.toISOString().split('T')[0];
        this.timeSeriesService.getAll(this.patientId, filter)
            .then((timeSeries: any) => {
                this.stepsValue = timeSeries.steps.summary.total;
                this.caloriesValue = timeSeries.calories.summary.total;
                this.activeMinutesValue = timeSeries.active_minutes.summary.total;
                this.distanceValue = timeSeries.distance.summary.total;
                this.calcImpact();
            })
            .catch(err => {
                this.stepsValue = 0;
                this.caloriesValue = 0;
                this.activeMinutesValue = 0;
                this.distanceValue = 0;
            });
    }

    openModalConfirmation(measurementId: string) {
        this.modalService.open('modalConfirmation');
        this.cacheIdForRemove = measurementId;
    }

    closeModalConfirmation() {
        this.cacheIdForRemove = '';
        this.modalService.close('modalConfirmation');
    }

    removeActivity(): void {
        this.modalService.close('modalConfirmation');
        this.removingActivity = true;
        this.physicalActivitiesService.remove(this.patientId, this.physicalActivity.id)
            .then(() => {
                this.router.navigate(['/app/activities', this.patientId, 'physical_activity']);
                this.removingActivity = false;
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-REMOVED'));
            })
            .catch(err => {
                this.removingActivity = false;
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-NOT-REMOVED'));
            })
    }
}
