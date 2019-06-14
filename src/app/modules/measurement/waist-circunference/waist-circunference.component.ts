import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';

import {IMeasurement, Measurement} from '../models/measurement';

@Component({
    selector: 'waist-circunference',
    templateUrl: './waist-circunference.component.html',
    styleUrls: ['./waist-circunference.component.scss']
})
export class WaistCircunferenceComponent implements OnInit, OnChanges {

    @Input() data: Array<IMeasurement>;

    lastData: IMeasurement;

    options: any;

    constructor(
        private datePipe: DatePipe
    ) {
        this.data = new Array<Measurement>();
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
            data: [],
            axisTick: {
                alignWithLabel: true
            }
        };

        const series = {
            type: 'bar',
            barWidth: '60%',
            color: '#00a594',
            data: [],
            markLine: {
                tooltip: {
                    trigger: 'item',
                    formatter: "Valor médio : {c} cm"
                },
                lineStyle: {
                    color: 'black',
                },
                data: [
                    {type: 'average', name: 'Média'}
                ]
            }
        };


        this.data.forEach((element: Measurement) => {
            xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            series.data.push(element.value);
        });


        this.options = {
            color: ['#3398DB'],
            tooltip: {
                formatter: "Circunferência : {c} cm <br> Data: {b}",
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: xAxis,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} cm'
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
