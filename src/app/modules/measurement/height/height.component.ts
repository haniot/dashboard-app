import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';

import {IMeasurement, Measurement} from '../models/measurement';

@Component({
    selector: 'height',
    templateUrl: './height.component.html',
    styleUrls: ['./height.component.scss']
})
export class HeightComponent implements OnInit, OnChanges {

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
            data: []
        };

        const series = {
            name: 'Altura',
            type: 'line',
            step: 'start',
            data: []
        };

        this.data.forEach((element: Measurement) => {
            xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            series.data.push(element.value);
        });


        this.options = {
            tooltip: {
                trigger: 'axis',
                formatter: "Altura: {c} cm <br> Data: {b}"
            },
            xAxis: xAxis,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} cm'
                }
            },
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
