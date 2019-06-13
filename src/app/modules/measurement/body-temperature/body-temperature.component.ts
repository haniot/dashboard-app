import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';

import * as _ from 'lodash';

import {IMeasurement} from '../models/measurement';
import {GraphService} from 'app/shared/shared-services/graph.service';
import {DecimalFormatterPipe} from "../pipes/decimal-formatter.pipe";

@Component({
    selector: 'body-temperature',
    templateUrl: './body-temperature.component.html',
    styleUrls: ['./body-temperature.component.scss']
})
export class BodyTemperatureComponent implements OnInit, OnChanges {

    @Input() data: Array<IMeasurement>;

    lastData: IMeasurement;

    option = {
        tooltip: {
            formatter: "Temperatura: {c} °C <br> Data: {b}",
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        dataZoom: [
            {
                type: 'slider'
            }
        ],
        series: [
            {
                name: 'Histórico de temperatura',
                type: 'line',
                data: [],
                markPoint: {
                    data: [
                        {type: 'max', name: 'Maximo'},
                        {type: 'min', name: 'Minimo'}
                    ]
                }
            }
        ]
    };


    constructor(
        private datePipe: DatePipe,
        private decimalPipe: DecimalFormatterPipe,
        private graphService: GraphService
    ) {
        this.data = new Array<IMeasurement>();
    }

    ngOnInit() {

    }

    loadGraph() {

        // Limpando o grafico
        this.option.xAxis.data = [];
        this.option.series[0].data = [];

        this.data.forEach((element: IMeasurement) => {
            this.option.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            this.option.series[0].data.push(this.decimalPipe.transform(element.value));
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
