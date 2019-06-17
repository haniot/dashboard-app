import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HeartRate} from '../models/heart-rate';

@Component({
    selector: 'heart-rate',
    templateUrl: './heart-rate.component.html',
    styleUrls: ['./heart-rate.component.scss']
})
export class HeartRateComponent implements OnInit, OnChanges {

    @Input() data: Array<HeartRate>;

    lastData: HeartRate;

    options: any;

    optionsLastData: any;


    constructor(
        private datePipe: DatePipe
    ) {
        this.data = new Array<HeartRate>();
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

        const xAxisOptions = {data: []};

        const seriesOptions = {
            type: 'line',
            data: []
        };

        const xAxisOptionsLastDate = {data: []};

        const seriesOptionsLastDate = {
            type: 'line',
            data: []
        };

        this.data.forEach((heartRate) => {
            if (heartRate.dataset) {
                heartRate.dataset.forEach((date: { value: number, timestamp: string }) => {
                    xAxisOptions.data.push(this.datePipe.transform(date.timestamp, "shortDate"));
                    seriesOptions.data.push(date.value);
                });
            }
        });


        if (this.lastData) {
            // Inserindo dados no gráfico da ultima medião
            if (this.lastData.dataset) {
                this.lastData.dataset.forEach((date: { value: number, timestamp: string }) => {

                    xAxisOptionsLastDate.data.push(this.datePipe.transform(date.timestamp, "mediumTime"));

                    seriesOptionsLastDate.data.push(date.value);

                });
            }
        }

        this.options = {
            title: {
                text: 'Histório de medições',
                subtext: 'O gráfico abaixo representa todos os valores captados em todas as medições realizadas'
            },
            tooltip: {
                formatter: "Frequência: {c} bpm <br> Data: {b}",
                trigger: 'axis'
            },
            xAxis: xAxisOptions,
            yAxis: {
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} bpm'
                }
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: seriesOptions
        };

        this.optionsLastData = {
            title: {
                text: 'Última medição realizada',
                subtext: 'O gráfico abaixo representa todos os valores captados na última medição realizada'
            },
            tooltip: {
                formatter: "Frequência: {c} bpm <br> Data: {b}",
                trigger: 'axis'
            },
            xAxis: xAxisOptionsLastDate,
            yAxis: {
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} bpm'
                }
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: seriesOptionsLastDate
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
