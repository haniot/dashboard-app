import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';

import * as _ from 'lodash';

import {GraphService} from 'app/shared/shared-services/graph.service';
import {DatePipe} from '@angular/common';
import {IMeasurement} from '../models/measurement';

@Component({
    selector: 'fat',
    templateUrl: './fat.component.html',
    styleUrls: ['./fat.component.scss']
})
export class FatComponent implements OnInit, OnChanges {

    @Input() data: Array<IMeasurement>;

    lastData: IMeasurement;

    option = {

        tooltip: {
            trigger: 'item',
            formatter: "Gordura : {c} %<br> Data: {b}"
        },
        xAxis: [
            {
                type: 'category',
                data: []
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                }
            }
        ],
        // visualMap: {
        //   // top: 5,
        //   // right: 10,
        //   pieces: [{
        //     gt: 0,
        //     lte: 25,
        //     color: '#00a594'
        //   }, {
        //     gt: 25,
        //     lte: 55,
        //     color: '#0071a5'
        //   }, {
        //     gt: 55,
        //     color: '#fd0808'
        //   }],
        //   outOfRange: {
        //     color: '#999'
        //   }
        // },
        dataZoom: [
            {
                type: 'slider'
            }
        ],
        series: [
            {
                type: 'bar',
                data: [],
                color: '#00a594',
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        offset: [0, -20],
                        formatter: function (param) {
                            return param.value + '%';
                        },
                        textStyle: {
                            fontSize: 18,
                            fontFamily: 'Arial'
                        }
                    }
                },
                markLine: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "Valor médio : {c} %"
                    },
                    lineStyle: {
                        color: 'black',
                    },
                    data: [
                        {type: 'average', name: 'Média'}
                    ]
                }
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
        this.option.xAxis[0].data = [];
        this.option.series[0].data = [];

        this.data.forEach((element: IMeasurement) => {
            this.option.series[0].data.push(element.value);

            const find = this.option.xAxis[0].data.find((ele) => {
                return ele == this.datePipe.transform(element.timestamp, "shortDate");
            });

            if (!find) {
                this.option.xAxis[0].data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            }


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
