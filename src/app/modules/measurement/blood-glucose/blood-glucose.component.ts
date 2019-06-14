import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {BloodGlucose, MealType} from '../models/blood-glucose';
import {GraphService} from "../../../shared/shared-services/graph.service";

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
        private graphService: GraphService
    ) {
        this.data = new Array<BloodGlucose>();
        this.lastData = new BloodGlucose();
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    loadGraph() {

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
                name: 'Pré-prandial',
                type: 'bar',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: 'Máximo'},
                        {type: 'min', name: 'Mínimo'}
                    ]
                }
            },
            {
                name: 'Pós-prandial',
                type: 'bar',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: 'Máximo'},
                        {type: 'min', name: 'Mínimo'}
                    ]
                }
            },
            {
                name: 'Jejum',
                type: 'bar',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: 'Máximo'},
                        {type: 'min', name: 'Mínimo'}
                    ]
                }
            },
            {
                name: 'Casual',
                type: 'bar',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: 'Máximo'},
                        {type: 'min', name: 'Mínimo'}
                    ]
                }
            },
            {
                name: 'Antes de dormir',
                type: 'bar',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: 'Máximo'},
                        {type: 'min', name: 'Mínimo'}
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
                formatter: "Glicose : {c} mg/dl<br> Data: {b}"
            },
            legend: {
                data: ['Pré-prandial', 'Pós-prandial', 'Jejum', 'Casual', 'Antes de dormir']
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
