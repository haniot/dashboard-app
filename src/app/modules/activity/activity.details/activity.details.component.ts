import { Component, OnInit } from '@angular/core';
import { PhysicalActivity } from '../models/physical.activity'
import { TimeSeries, TimeSeriesItem } from '../models/time.series'
import { TranslateService } from '@ngx-translate/core'
import { DatePipe } from '@angular/common'
import { ActivityLevel, Levels } from '../models/activity'
import { MillisecondPipe } from '../pipes/millisecond.pipe'

@Component({
    selector: 'activity.details',
    templateUrl: './activity.details.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './activity.details.component.scss']
})
export class ActivityDetailsComponent implements OnInit {
    physicalActivity: PhysicalActivity
    intensityLevelsGraph: any;
    heartRateGraph: any;
    Math = Math;

    constructor(
        private datePipe: DatePipe,
        private millisecondPipe: MillisecondPipe,
        private translateService: TranslateService) {
        this.physicalActivity = new PhysicalActivity()
    }

    ngOnInit() {
        this.loadIntensityLevelsGraph();
        this.loadHeartRateGraph();
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
            return element.name === Levels.SEDENTARY
        })

        const lightData = this.physicalActivity.levels.filter((element: ActivityLevel) => {
            return element.name === Levels.LIGHT
        })

        const fairlyData = this.physicalActivity.levels.filter((element: ActivityLevel) => {
            return element.name === Levels.FAIRLY
        })

        const veryData = this.physicalActivity.levels.filter((element: ActivityLevel) => {
            return element.name === Levels.VERY
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
                data: [sedentary, light, fairly, very]
            },
            series: {
                type: 'pie',
                radius: '55%',
                data: [
                    {
                        value: sedentaryData[0].duration,
                        name: sedentary,
                        duration: this.millisecondPipe.transform(sedentaryData[0].duration)
                    },
                    { value: lightData[0].duration, name: light, duration: this.millisecondPipe.transform(lightData[0].duration) },
                    { value: fairlyData[0].duration, name: fairly, duration: this.millisecondPipe.transform(fairlyData[0].duration) },
                    { value: veryData[0].duration, name: very, duration: this.millisecondPipe.transform(veryData[0].duration) }],
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

    loadHeartRateGraph() {
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

        const heartRateMock = new TimeSeries();
        heartRateMock.data_set = [
            { value: 50, date: '2016-10-03T05:59:20' }, {
                value: 143,
                date: '2014-09-26T09:35:11'
            }, { value: 5, date: '2016-04-29T01:39:18' }, { value: 85, date: '2014-10-12T02:14:09' }, {
                value: 125,
                date: '2015-03-07T10:33:04'
            }, { value: 71, date: '2015-02-03T02:02:05' }, { value: 134, date: '2014-08-15T07:37:07' }, {
                value: 126,
                date: '2016-03-31T07:06:59'
            }, { value: 54, date: '2014-08-20T10:04:14' }, { value: 144, date: '2014-03-08T08:13:13' }, {
                value: 97,
                date: '2019-06-06T03:51:03'
            }, { value: 102, date: '2015-12-15T07:44:19' }, { value: 133, date: '2015-01-09T12:28:56' }, {
                value: 30,
                date: '2018-03-31T11:40:35'
            }, { value: 42, date: '2016-12-16T05:35:41' }, { value: 119, date: '2014-10-22T09:18:48' }, {
                value: 128,
                date: '2016-12-01T07:11:20'
            }, { value: 115, date: '2015-11-09T12:33:34' }, { value: 26, date: '2017-07-12T09:49:07' }, {
                value: 124,
                date: '2019-07-27T08:57:29'
            }, { value: 92, date: '2016-10-03T05:59:13' }, { value: 30, date: '2019-11-16T03:52:47' }, {
                value: 83,
                date: '2014-11-03T12:49:58'
            }, { value: 52, date: '2015-10-01T07:57:48' }, { value: 59, date: '2015-05-11T01:22:55' }, {
                value: 48,
                date: '2017-03-06T09:20:24'
            }, { value: 143, date: '2018-12-13T03:45:07' }, { value: 6, date: '2018-04-19T04:26:40' }, {
                value: 31,
                date: '2017-11-20T02:08:31'
            }, { value: 127, date: '2018-05-27T07:01:44' }, { value: 20, date: '2014-12-22T11:06:15' }, {
                value: 76,
                date: '2017-06-18T02:21:36'
            }, { value: 104, date: '2018-03-13T10:04:29' }, { value: 141, date: '2017-10-11T11:48:58' }, {
                value: 19,
                date: '2019-10-16T10:39:26'
            }, { value: 133, date: '2016-11-12T05:04:00' }, { value: 147, date: '2014-07-10T02:34:48' }, {
                value: 19,
                date: '2018-01-02T10:47:17'
            }, { value: 35, date: '2018-07-29T10:16:46' }, { value: 50, date: '2019-09-29T07:24:52' }, {
                value: 92,
                date: '2017-12-23T12:44:47'
            }, { value: 75, date: '2017-10-18T03:08:08' }, { value: 123, date: '2016-01-19T11:33:53' }, {
                value: 66,
                date: '2014-10-28T12:54:37'
            }, { value: 53, date: '2017-04-10T08:31:50' }, { value: 66, date: '2016-03-20T09:10:58' }, {
                value: 135,
                date: '2019-07-24T12:51:58'
            }, { value: 45, date: '2015-05-01T08:30:10' }, { value: 77, date: '2018-01-17T06:50:44' }, {
                value: 130,
                date: '2017-10-27T12:43:22'
            }, { value: 118, date: '2014-12-10T11:23:00' }, { value: 62, date: '2017-06-02T05:20:43' }, {
                value: 141,
                date: '2016-11-20T08:02:11'
            }, { value: 107, date: '2015-01-31T02:36:54' }, { value: 52, date: '2016-12-07T07:54:08' }, {
                value: 51,
                date: '2016-11-30T11:49:40'
            }]
        const data = [heartRateMock];

        data.forEach((heartRate) => {
            if (heartRate.data_set) {
                heartRate.data_set.forEach((element: TimeSeriesItem) => {
                    xAxisOptionsLastDate.data.push(this.datePipe.transform(element.date, 'shortDate'));
                    seriesOptionsLastDate.data.push({
                        value: element.value,
                        time: this.datePipe.transform(element.date, 'mediumTime'),
                        date: this.datePipe.transform(element.date, 'shortDate')
                    });
                });
            }
        });

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
}
