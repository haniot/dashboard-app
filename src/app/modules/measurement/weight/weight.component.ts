import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {GraphService} from 'app/shared/shared-services/graph.service';
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

    weightGraph = {
        tooltip: {
            formatter: "Peso: {c} Kg <br> Data: {b}"
        },
        xAxis: {
            type: 'category',
            data: []
        },
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
        series: [
            {
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
            }
        ]
    };

    fatGraph = {
        tooltip: {
            formatter: "Gordura: {c} % <br> Data: {b}"
        },
        xAxis: {
            type: 'category',
            data: []
        },
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
        series: [
            {
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
            }
        ]
    };


    constructor(
        private datePipe: DatePipe,
        private decimalPipe: DecimalFormatterPipe,
        private graphService: GraphService
    ) {
        this.data = new Array<Weight>();
    }

    ngOnInit() {

    }

    loadGraph() {

        // Limpando o grafico de peso
        this.weightGraph.xAxis.data = [];
        this.weightGraph.series[0].data = [];

        this.lastIndex = 0;

        this.data.forEach((element: Weight) => {
            this.weightGraph.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            this.weightGraph.series[0].data.push(this.decimalPipe.transform(element.value));
        });

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        // Limpando o grafico de gordura
        this.fatGraph.xAxis.data = [];
        this.fatGraph.series[0].data = [];

        this.data.forEach((element: Weight) => {
            if (element.fat && element.fat.value) {
                this.fatGraph.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
                this.fatGraph.series[0].data.push(element.fat.value);
            }
        });

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
