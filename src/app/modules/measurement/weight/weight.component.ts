import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';

import {Weight} from '../models/wieght';
import {DecimalFormatterPipe} from "../pipes/decimal-formatter.pipe";


@Component({
    selector: 'weight',
    templateUrl: './weight.component.html',
    styleUrls: ['./weight.component.scss']
})
export class WeightComponent implements OnInit, OnChanges {

    @Input() data: Array<Weight>;

    lastData: Weight;

    lastIndex: number;

    weightGraph: any;

    fatGraph: any;


    constructor(
        private datePipe: DatePipe,
        private decimalPipe: DecimalFormatterPipe
    ) {
        this.data = new Array<Weight>();
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    loadGraph() {

        this.lastIndex = 0;

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        /* Configurações do gráfico de peso*/
        const xAxisWeight = {
            type: 'category',
            data: []
        }

        const seriesWeight = {
            name: "Peso",
            data: [],
            type: 'line',
            symbol: 'circle',
            symbolSize: 20,
            lineStyle: {
                normal: {
                    color: 'green',
                    width: 4,
                    type: 'dashed'
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 3,
                    borderColor: 'yellow',
                    color: 'blue'
                }
            }
        };

        /* Configurações do gráfico de gordura*/
        const xAxisFat = {type: 'category', data: []};

        const seriesFat = {
            name: "Gordura corporal",
            data: [],
            type: 'bar',
            symbol: 'circle',
            symbolSize: 20,
            lineStyle: {
                normal: {
                    color: 'green',
                    width: 4,
                    type: 'dashed'
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 3,
                    borderColor: 'yellow',
                    color: 'orange'
                }
            }
        };

        this.data.forEach((element: Weight) => {
            xAxisWeight.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            seriesWeight.data.push(this.decimalPipe.transform(element.value));
            if (element.fat && element.fat.value) {
                xAxisFat.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
                seriesFat.data.push(element.fat.value);
            }
        });

        this.weightGraph = {
            tooltip: {
                formatter: "Peso: {c} Kg <br> Data: {b}"
            },
            xAxis: xAxisWeight,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} kg'
                }
            },
            legend: {
                data: ['Peso']
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: seriesWeight
        };

        this.fatGraph = {
            tooltip: {
                formatter: "Gordura: {c} % <br> Data: {b}"
            },
            xAxis: xAxisFat,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            legend: {
                data: ['Gordura corporal']
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: seriesFat
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
