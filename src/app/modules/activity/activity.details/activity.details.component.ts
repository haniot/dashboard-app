import { Component, OnInit } from '@angular/core';
import { PhysicalActivity } from '../models/physical.activity'
import {
    HeartRateZone,
    TimeSeries,
    TimeSeriesFullFilter,
    TimeSeriesItemIntraday,
    TimeSeriesSimpleFilter, TimeSeriesType
} from '../models/time.series'
import { TranslateService } from '@ngx-translate/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivityLevel, Levels } from '../models/activity';
import { MillisecondPipe } from '../pipes/millisecond.pipe';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service';
import { PhysicalActivitiesService } from '../services/physical.activities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TimeSeriesService } from '../services/time.series.service';
import * as echarts from 'echarts';

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
    caloriesGraph: any;
    caloriesError: boolean;
    heartRateGraph: any;
    heartRateError: boolean;
    zones: HeartRateZone;

    constructor(
        private activeRouter: ActivatedRoute,
        private datePipe: DatePipe,
        private decimalPipe: DecimalPipe,
        private millisecondPipe: MillisecondPipe,
        private translateService: TranslateService,
        private modalService: ModalService,
        private physicalActivitiesService: PhysicalActivitiesService,
        private timeSeriesService: TimeSeriesService,
        private router: Router,
        private toastService: ToastrService) {
        this.zones = new HeartRateZone();
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            const activityId = params.get('activityId');
            this.loadActivity(activityId);
        });
    }

    calcImpact(): void {
        this.impactOfSteps = Math.min(Math.floor((this.physicalActivity.steps * 100) / this.stepsValue), 100);
        this.impactOfCalories = Math.min(Math.floor((this.physicalActivity.calories * 100) / this.caloriesValue), 100);
        this.impactOfActiveMinutes = Math.min(Math.floor(((this.physicalActivity.duration / 60000) * 100) / this.activeMinutesValue), 100);
    }

    loadActivity(activityId: string): void {
        this.loadingPhysicalActivity = true;
        this.physicalActivitiesService.getById(this.patientId, activityId)
            .then(physicalActivity => {
                this.loadingPhysicalActivity = false;
                this.physicalActivity = physicalActivity;
                this.loadTimeSeries();
                this.loadIntensityLevelsGraph();
                this.loadCalories();
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
            grid: [
                { x: '7%', y: '7%', width: '90%', height: '95%' }
            ],
            legend: {
                orient: 'horizontal',
                top: 10,
                left: 10,
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

    loadCalories(): void {
        if (this.physicalActivity && this.physicalActivity.calories) {
            const start_zone = this.physicalActivity.start_time.split('.')[1]
            const start_date = new Date(this.datePipe.transform(this.physicalActivity.start_time, 'shortDate', start_zone, 'en-us'));
            const end_zone = this.physicalActivity.end_time.split('.')[1]
            const end_date = new Date(this.datePipe.transform(this.physicalActivity.end_time, 'shortDate', end_zone, 'en-us'));
            const filter = new TimeSeriesFullFilter();
            filter.start_date = start_date.toISOString().split('T')[0];
            filter.end_date = end_date.toISOString().split('T')[0];
            filter.start_time = this.datePipe.transform(this.physicalActivity.start_time, 'HH:mm:ss');
            filter.end_time = this.datePipe.transform(this.physicalActivity.end_time, 'HH:mm:ss');
            filter.interval = '1s';
            this.timeSeriesService.getWithResourceAndTime(this.patientId, TimeSeriesType.calories, filter)
                .then(resource => {
                    this.caloriesError = false;
                    this.updateCalories(resource);
                })
                .catch(() => {
                    this.caloriesError = true;
                })
        }
    }

    updateCalories(resource: TimeSeries) {
        const labelCalories = this.translateService.instant('TIME-SERIES.CALORIES.TITLE');
        const hour = this.translateService.instant('SHARED.HOUR');

        const series = {
            type: 'line',
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
                    color: 'rgba(251,165,62,0.1)'
                }])
            },
            data: []
        };

        const xAxisLength = resource.data_set.length;

        const xAxis = {
            data: [],
            axisLabel: {
                formatter: (value, index) => {
                    return (index === 0) || (index === xAxisLength - 1) ? value : '';
                },
                showMinLabel: true,
                showMaxLabel: true
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            boundaryGap: false
        }

        const yAxis = {
            type: 'value',
            splitNumber: 1,
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            }
        };

        if (resource && resource.data_set) {
            resource.data_set.forEach((calorie: TimeSeriesItemIntraday) => {
                xAxis.data.push(calorie.time);
                series.data.push({
                    value: calorie.value,
                    time: calorie.time
                });
            });
        }

        const total = resource.data_set.reduce((previous, current) => {
            return previous + current.value;
        }, 0);

        if (!total) {
            series.data = [];
        }

        this.caloriesGraph = {
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
                formatter: (params) => {
                    const { data: { value, time } } = params[0];
                    const valueFormatted = this.decimalPipe.transform(value, '1.2-3');
                    return `${labelCalories} : ${valueFormatted} cals <br> ${hour}: ${time}`
                }
            },
            graphic: {
                type: 'image',
                id: 'logo',
                left: 25,
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
            grid: [{ x: '3%', y: '10%', width: '94%', height: '80%' }],
            xAxis,
            yAxis,
            series
        }
    }

    loadHeartRate(): void {
        if (this.physicalActivity && this.physicalActivity.heart_rate_average) {
            const start_zone = this.physicalActivity.start_time.split('.')[1]
            const start_date = new Date(this.datePipe.transform(this.physicalActivity.start_time, 'shortDate', start_zone, 'en-us'));
            const end_zone = this.physicalActivity.end_time.split('.')[1]
            const end_date = new Date(this.datePipe.transform(this.physicalActivity.end_time, 'shortDate', end_zone, 'en-us'));
            const filter = new TimeSeriesFullFilter();
            filter.start_date = start_date.toISOString().split('T')[0];
            filter.end_date = end_date.toISOString().split('T')[0];
            filter.start_time = this.datePipe.transform(this.physicalActivity.start_time, 'HH:mm:ss');
            filter.end_time = this.datePipe.transform(this.physicalActivity.end_time, 'HH:mm:ss');
            filter.interval = '1s';
            this.timeSeriesService.getWithResourceAndTime(this.patientId, TimeSeriesType.heart_rate, filter)
                .then((resource: any) => {
                    this.heartRateError = false;
                    this.zones = resource.summary && resource.summary.zones ? resource.summary.zones : new HeartRateZone();
                    this.loadHeartRateGraph(resource);
                })
                .catch(() => {
                    this.heartRateError = true;
                })
        }
    }

    loadHeartRateGraph(resource: TimeSeries) {
        const frequency = this.translateService.instant('TIME-SERIES.HEART-RATE.FREQUENCY');
        const hour = this.translateService.instant('SHARED.HOUR');
        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');
        const name_fat_burn = this.translateService.instant('TIME-SERIES.HEART-RATE.FAT-BURN');
        const name_cardio = this.translateService.instant('TIME-SERIES.HEART-RATE.CARDIO');
        const name_peak = this.translateService.instant('TIME-SERIES.HEART-RATE.PEAK');
        const name_out_of_range = this.translateService.instant('TIME-SERIES.HEART-RATE.OUT-OF-RANGE');

        const xAxisLenght = resource && resource.data_set ? resource.data_set.length : 0;

        const xAxisOptionsLastDate = {
            data: [],
            axisLabel: {
                formatter: (value, index) => {
                    return (index === 0) || (index === xAxisLenght - 1) ? value : '';
                },
                showMinLabel: true,
                showMaxLabel: true
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            boundaryGap: false
        };

        const seriesOptionsLastDate = {
            type: 'line',
            data: [],
            color: '#7F7F7F',
            lineStyle: {
                normal: {
                    width: 4
                }
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
            resource.data_set.forEach((heartRate: TimeSeriesItemIntraday) => {
                xAxisOptionsLastDate.data.push(heartRate.time);
                seriesOptionsLastDate.data.push({
                    value: heartRate.value,
                    time: heartRate.time
                });
            });
        }

        this.heartRateGraph = {
            title: {
                show: !seriesOptionsLastDate.data || !seriesOptionsLastDate.data.length,
                text: this.translateService.instant('ACTIVITY.PHYSICAL-ACTIVITY.TIME-SERIES-UNAVAILABLE'),
                top: 'center',
                left: 'center',
                textStyle: {
                    fontSize: 12
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params[0].data.type === 'max' || params[0].data.type === 'min') {
                        const t = seriesOptionsLastDate.data.find(currenHeartRate => {
                            return currenHeartRate.value === params[0].value;
                        });
                        if (t) {
                            return `${frequency} : ${t.value} bpm <br> ${hour}:${t.time}`
                        }

                    }
                    const { value, time } = params[0].data
                    return `${frequency} : ${value} bpm <br> ${hour}: ${time}`
                }
            },
            grid: [
                { x: '4%', y: '15%', width: '93%', height: '75%' }
            ],
            dataZoom: {
                type: 'inside'
            },
            graphic: {
                type: 'image',
                id: 'logo',
                left: 30,
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
            xAxis: xAxisOptionsLastDate,
            yAxis: {
                type: 'value',
                splitNumber: 1,
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            },
            visualMap: {
                orient: 'horizontal',
                bottom: 20,
                left: '30%',
                right: '30%',
                pieces: [{
                    gt: this.zones.fat_burn.min,
                    lte: this.zones.fat_burn.max,
                    label: name_fat_burn,
                    color: '#FFC023'
                }, {
                    gt: this.zones.cardio.min,
                    lte: this.zones.cardio.max,
                    label: name_cardio,
                    color: '#FD8518'
                }, {
                    gt: this.zones.peak.min,
                    lte: this.zones.peak.max,
                    label: name_peak,
                    color: '#E60013'
                }, {
                    gt: this.zones.out_of_range.min,
                    lte: this.zones.out_of_range.max,
                    label: name_out_of_range,
                    color: '#4EC5C5'
                }
                ]
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
