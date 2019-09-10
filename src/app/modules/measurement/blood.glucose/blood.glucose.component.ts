import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { BloodGlucose, MealType } from '../models/blood-glucose';
import { MeasurementService } from '../services/measurement.service';
import { EnumMeasurementType, SearchForPeriod } from '../models/measurement'

@Component({
    selector: 'blood-glucose',
    templateUrl: './blood.glucose.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class BloodGlucoseComponent implements OnInit, OnChanges {

    @Input() data: Array<BloodGlucose>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;
    lastData: BloodGlucose;
    options: any;
    showSpinner: boolean;
    echartsInstance: any;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.data = new Array<BloodGlucose>();
        this.lastData = new BloodGlucose();
        this.filter_visibility = false;
        this.patientId = '';
        this.showSpinner = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    loadGraph() {

        const preprandial = this.translateService.instant('MEASUREMENTS.PIPES.MEAL.PREPRANDIAL');
        const postprandial = this.translateService.instant('MEASUREMENTS.PIPES.MEAL.POSTPRANDIAL');
        const fasting = this.translateService.instant('MEASUREMENTS.PIPES.MEAL.FASTING');
        const casual = this.translateService.instant('MEASUREMENTS.PIPES.MEAL.CASUAL');
        const bedtime = this.translateService.instant('MEASUREMENTS.PIPES.MEAL.BEDTIME');
        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');
        const glucose = this.translateService.instant('MEASUREMENTS.BLOOD-GLUCOSE.GLUCOSE');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxis = {
            type: 'category',
            data: []
        };

        const markPoint = {
            label: {
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

        const series = [
            {
                name: preprandial,
                type: 'bar',
                data: [],
                barMaxWidth: 100,
                color: '#e57373',
                markPoint: markPoint
            },
            {
                name: postprandial,
                type: 'bar',
                data: [],
                barMaxWidth: 100,
                color: '#2f4553',
                markPoint: markPoint
            },
            {
                name: fasting,
                type: 'bar',
                data: [],
                barMaxWidth: 100,
                color: '#629fa6',
                markPoint: markPoint
            },
            {
                name: casual,
                type: 'bar',
                data: [],
                barMaxWidth: 100,
                color: '#d28168',
                markPoint: markPoint
            },
            {
                name: bedtime,
                type: 'bar',
                data: [],
                barMaxWidth: 100,
                color: '#629fa6',
                markPoint: markPoint
            }
        ];

        const preprandials = this.data.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.preprandial;
        });
        const postprandials = this.data.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.postprandial;
        });
        const fastings = this.data.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.fasting;
        });
        const casuals = this.data.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.casual;
        });
        const bedtimes = this.data.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.bedtime;
        });


        this.data.forEach((element: BloodGlucose, index) => {
            const mediumTime = this.datePipe.transform(element.timestamp, 'mediumTime');
            const newDate = this.datePipe.transform(element.timestamp, 'shortDate');
            const findDate = xAxis.data.find(currentDate => {
                return currentDate === newDate
            })

            if (findDate) {
                index = xAxis.data.indexOf(findDate);
            } else {
                index = xAxis.data.push(newDate) - 1;
            }

            switch (element.meal) {
                case MealType.preprandial:
                    series[0].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.postprandial:
                    series[1].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.fasting:
                    series[2].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.casual:
                    series[3].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.bedtime:
                    series[4].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
            }
        });

        this.options = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if (!params.data || !params.data.time) {
                        const t = series[params.seriesIndex].data.find(currentHeight => {
                            if (currentHeight) {
                                return currentHeight.value === params.data.value;
                            }
                        });
                        params.data.time = t.time;

                    }
                    return `${glucose}: ${params.data.value}mg/dl<br> ${date}: <br>${params.name} ${at} ${params.data.time}`
                }
            },
            legend: {
                data: [preprandial, postprandial, fasting, casual, bedtime]
            },
            xAxis: xAxis,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}mg/dl'
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

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.blood_glucose, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
            })
            .catch(() => {
            });
    }

    updateGraph(measurements: Array<any>): void {
        const preprandials = measurements.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.preprandial;
        });
        const postprandials = measurements.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.postprandial;
        });
        const fastings = measurements.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.fasting;
        });
        const casuals = measurements.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.casual;
        });
        const bedtimes = measurements.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.bedtime;
        });

        // clean
        this.options.xAxis.data = [];
        this.options.series[0].data = new Array(preprandials.length);
        this.options.series[1].data = new Array(preprandials.length + postprandials.length);
        this.options.series[2].data = new Array(postprandials.length + fastings.length);
        this.options.series[3].data = new Array(fastings.length + casuals.length);
        this.options.series[4].data = new Array(casuals.length + bedtimes.length);

        measurements.forEach((element: BloodGlucose, index) => {
            const mediumTime = this.datePipe.transform(element.timestamp, 'mediumTime');
            const newDate = this.datePipe.transform(element.timestamp, 'shortDate');
            const findDate = this.options.xAxis.data.find(currentDate => {
                return currentDate === newDate
            })

            if (findDate) {
                index = this.options.xAxis.data.indexOf(findDate);
            } else {
                index = this.options.xAxis.data.push(newDate) - 1;
            }

            switch (element.meal) {
                case MealType.preprandial:
                    this.options.series[0].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.postprandial:
                    this.options.series[1].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.fasting:
                    this.options.series[2].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.casual:
                    this.options.series[3].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.bedtime:
                    this.options.series[4].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
            }
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
