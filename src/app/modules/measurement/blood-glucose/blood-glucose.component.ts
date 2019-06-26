import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {BloodGlucose, MealType} from '../models/blood-glucose';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'blood-glucose',
    templateUrl: './blood-glucose.component.html',
    styleUrls: ['./blood-glucose.component.scss']
})
export class BloodGlucoseComponent implements OnInit, OnChanges {

    @Input() data: Array<BloodGlucose>;

    lastData: BloodGlucose;

    options: any;


    constructor(
        private datePipe: DatePipe,
        private translateService: TranslateService
    ) {
        this.data = new Array<BloodGlucose>();
        this.lastData = new BloodGlucose();
    }

    ngOnInit(): void {
        this.loadGraph();
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

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxis = {
            type: 'category',
            data: []
        };

        const series = [
            {
                name: preprandial,
                type: 'bar',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: max},
                        {type: 'min', name: min}
                    ]
                }
            },
            {
                name: postprandial,
                type: 'bar',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: max},
                        {type: 'min', name: min}
                    ]
                }
            },
            {
                name: fasting,
                type: 'bar',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: max},
                        {type: 'min', name: min}
                    ]
                }
            },
            {
                name: casual,
                type: 'bar',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: max},
                        {type: 'min', name: min}
                    ]
                }
            },
            {
                name: bedtime,
                type: 'bar',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: max},
                        {type: 'min', name: min}
                    ]
                }
            }
        ];

        this.data.forEach((element: BloodGlucose) => {
            const find = xAxis.data.find((ele) => {
                return ele === this.datePipe.transform(element.timestamp, "shortDate");
            });

            if (!find) {
                xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            }
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
                formatter: glucose + " : {c} mg/dl<br> Data: {b}"
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

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }

}
