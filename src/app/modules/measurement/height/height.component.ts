import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';
import {DatePipe} from '@angular/common';

import * as _ from 'lodash';

import {IMeasurement} from '../models/measurement';
import {GraphService} from 'app/shared/shared-services/graph.service';

@Component({
    selector: 'height',
    templateUrl: './height.component.html',
    styleUrls: ['./height.component.scss']
})
export class HeightComponent implements OnInit, OnChanges {

    @Input() data: Array<IMeasurement>;

    lastData: IMeasurement;

    option = {
        tooltip: {
            trigger: 'axis',
            formatter: "Altura: {c} cm <br> Data: {b}"
        },
        xAxis: {
            type: 'category',
            data: []
        },
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
        series: [
            {
                name: 'Altura',
                type: 'line',
                step: 'start',
                data: []
            }
        ]
    };


    constructor(
        private datePipe: DatePipe,
        private graphService: GraphService
    ) {
        this.data = new Array<IMeasurement>();

    }

    ngOnInit() {

    }

    loadGraph() {

        //Limpando o grafico
        this.option.xAxis.data = [];
        this.option.series[0].data = [];

        this.data.forEach((element: IMeasurement) => {
            this.option.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            this.option.series[0].data.push(element.value);
        });

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        this.graphService.refreshGraph();


    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }


}
