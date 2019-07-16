import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DatePipe} from '@angular/common';
import {BloodPressure} from '../models/blood-pressure';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'blood-pressure',
    templateUrl: './blood-pressure.component.html',
    styleUrls: ['./blood-pressure.component.scss']
})
export class BloodPressureComponent implements OnInit, OnChanges {

    @Input() data: Array<BloodPressure>;
    @Input() filter_visibility: boolean;

    lastData: BloodPressure;

    options: any;

    constructor(
        private datePipe: DatePipe,
        private translateService: TranslateService
    ) {
        this.data = new Array<BloodPressure>();
        this.filter_visibility = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    loadGraph() {

        const systolic = this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.SYSTOLIC');
        const diastolic = this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.DIASTOLIC');
        const pulse = this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.PULSE');
        const pressure = this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.PRESSURE');
        const date = this.translateService.instant('SHARED.DATE');

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
                name: systolic,
                data: [],
                type: 'line',
                symbol: 'circle',
                symbolSize: 20,
                lineStyle: {
                    normal: {
                        color: 'blue',
                        width: 4,
                        type: ''
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 3,
                        borderColor: 'white',
                        color: 'blue'
                    }
                }
            },
            {
                name: diastolic,
                data: [],
                type: 'line',
                symbol: 'triangle',
                symbolSize: 20,
                lineStyle: {
                    normal: {
                        color: 'red',
                        width: 4,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 3,
                        borderColor: 'white',
                        color: 'red'
                    }
                }
            },
            {
                name: pulse,
                data: [],
                type: 'line',
                symbol: 'line',
                symbolSize: 20,
                lineStyle: {
                    normal: {
                        color: 'black',
                        width: 4,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 3,
                        borderColor: 'white',
                        color: 'black'
                    }
                }
            }
        ]

        this.data.forEach((element: BloodPressure) => {
            const find = xAxis.data.find((ele) => {
                return ele === this.datePipe.transform(element.timestamp, "shortDate");
            });

            if (!find) {
                xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            }
            // Adicionando Sistólica
            series[0].data.push(element.systolic);

            // Adicionando Diastólica
            series[1].data.push(element.diastolic);

            // Adicionando Pulso
            series[2].data.push(element.pulse);
        });

        this.options = {
            tooltip: {
                trigger: 'item',
                formatter: pressure + `: {c} mmHg<br> ${date}: {b}`
            },
            legend: {
                data: [systolic, diastolic, pulse]
            },
            xAxis: xAxis,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} mmHg'
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
