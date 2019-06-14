import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {IMeasurement, Measurement} from '../models/measurement';
import {GraphService} from "../../../shared/shared-services/graph.service";

@Component({
    selector: 'fat',
    templateUrl: './fat.component.html',
    styleUrls: ['./fat.component.scss']
})
export class FatComponent implements OnInit, OnChanges {

    @Input() data: Array<IMeasurement>;

    lastData: IMeasurement;

    options: any;

    constructor(
        private datePipe: DatePipe,
        private graphService: GraphService
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
            markLine:
                {
                    tooltip: {
                        trigger: 'item',
                        formatter:
                            "Valor médio : {c} %"
                    }
                    ,
                    lineStyle: {
                        color: 'black',
                    }
                    ,
                    data: [
                        {type: 'average', name: 'Média'}
                    ]
                }
        };

        this.data.forEach((element: Measurement) => {
            series.data.push(element.value);

            const find = xAxis.data.find((ele) => {
                return ele === this.datePipe.transform(element.timestamp, "shortDate");
            });

            if (!find) {
                xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            }

        });


        this.options = {

            tooltip: {
                trigger: 'item',
                formatter: "Gordura : {c} %<br> Data: {b}"
            },
            xAxis: xAxis,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} %'
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
