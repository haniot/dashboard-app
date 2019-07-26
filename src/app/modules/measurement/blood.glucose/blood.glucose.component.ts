import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { BloodGlucose, MealType } from '../models/blood-glucose';
import { MeasurementType } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';

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
        const date = this.translateService.instant('SHARED.DATE');

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
                markPoint: markPoint
            },
            {
                name: postprandial,
                type: 'bar',
                data: [],
                markPoint: markPoint
            },
            {
                name: fasting,
                type: 'bar',
                data: [],
                markPoint: markPoint
            },
            {
                name: casual,
                type: 'bar',
                data: [],
                markPoint: markPoint
            },
            {
                name: bedtime,
                type: 'bar',
                data: [],
                markPoint: markPoint
            }
        ];

        this.data.forEach((element: BloodGlucose) => {
            xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            switch (element.meal) {
                case MealType.preprandial:
                    series[0].data.push(element.value);
                    break;
                case MealType.postprandial:
                    series[1].data.push(element.value);
                    break;
                case MealType.fasting:
                    series[2].data.push(element.value);
                    break;
                case MealType.casual:
                    series[3].data.push(element.value);
                    break;
                case MealType.bedtime:
                    series[4].data.push(element.value);
                    break;
            }
        });

        this.options = {

            tooltip: {
                trigger: 'item',
                formatter: glucose + ` : {c} mg/dl<br> ${date}: {b}`
            },
            legend: {
                data: [preprandial, postprandial, fasting, casual, bedtime]
            },

            xAxis: xAxis,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} mg/dl'
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

    applyFilter(filter: { start_at: string, end_at: string, period: string }) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.blood_glucose, null, null, filter)
            .then((measurements: Array<any>) => {
                this.data = measurements;
                this.showSpinner = false;
                this.updateGraph(measurements);
            })
            .catch();
    }

    updateGraph(measurements: Array<any>): void {
        // clean
        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((element: BloodGlucose) => {
            this.options.xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));

            switch (element.meal) {
                case MealType.preprandial:
                    this.options.series[0].data.push(element.value);
                    break;
                case MealType.postprandial:
                    this.options.series[1].data.push(element.value);
                    break;
                case MealType.fasting:
                    this.options.series[2].data.push(element.value);
                    break;
                case MealType.casual:
                    this.options.series[3].data.push(element.value);
                    break;
                case MealType.bedtime:
                    this.options.series[4].data.push(element.value);
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
