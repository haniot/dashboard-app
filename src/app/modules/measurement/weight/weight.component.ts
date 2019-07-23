import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { Weight } from '../models/weight';
import { DecimalFormatterPipe } from '../pipes/decimal-formatter.pipe';
import { MeasurementType } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';

@Component({
    selector: 'weight',
    templateUrl: './weight.component.html',
    styleUrls: ['../shared-style/shared-styles.scss']
})
export class WeightComponent implements OnInit, OnChanges {

    @Input() data: Array<Weight>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;

    lastData: Weight;

    lastIndex: number;

    weightGraph: any;

    showSpinner: boolean;

    echartsInstance: any;

    constructor(
        private datePipe: DatePipe,
        private decimalPipe: DecimalFormatterPipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.data = new Array<Weight>();
        this.filter_visibility = false;
        this.patientId = "";
        this.showSpinner = false;
    }

    ngOnInit(): void {
        this.loadGraph();
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    loadGraph(): any {

        const weigth = this.translateService.instant('MEASUREMENTS.WEIGHT.TITLE');
        const body_fat = this.translateService.instant('MEASUREMENTS.WEIGHT.BODY-FAT');
        const date = this.translateService.instant('SHARED.DATE');

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
            name: weigth,
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
            name: body_fat,
            data: [],
            type: 'line',
            symbol: 'square',
            symbolSize: 20,
            lineStyle: {
                normal: {
                    color: 'orange',
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
            // TODO: Remover
            seriesFat.data.push(25);
            if (element.fat && element.fat.value) {
                xAxisFat.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
                seriesFat.data.push(element.fat.value);
            }
        });

        this.weightGraph = {
            tooltip: {
                formatter: function (params) {
                    if (params.seriesName === weigth) {
                        return weigth +
                            `: ${params.data} Kg <br> ${date}: ${params.name}`;
                    }
                    return body_fat +
                        `: ${params.data} % <br> ${date}: ${params.name}`;
                }
            },
            xAxis: xAxisWeight,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            legend: {
                data: [weigth, body_fat]
            },
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: [
                seriesWeight,
                seriesFat
            ]
        };
    }

    applyFilter(filter: any) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.weight, null, null, filter)
            .then((measurements: Array<any>) => {
                this.data = measurements;
                this.showSpinner = false;
                this.updateGraph(measurements);
            })
            .catch(errorResponse => {
                // this.toastService.error('Não foi possível buscar medições!');
                // console.log('Não foi possível buscar medições!', errorResponse);
            });
    }

    updateGraph(measurements: Array<any>): void {
        // clean weightGraph
        this.weightGraph.xAxis.data = new Array<any>();
        this.weightGraph.series[0].data = new Array<any>();
        this.weightGraph.series[1].data = new Array<any>();

        measurements.forEach((element: Weight) => {
            this.weightGraph.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
            this.weightGraph.series[0].data.push(this.decimalPipe.transform(element.value));
            this.weightGraph.series[1].data.push(25);
            if (element.fat && element.fat.value) {
                this.weightGraph.xAxis.data.push(this.datePipe.transform(element.timestamp, "shortDate"));
                this.weightGraph.series[1].data.push(element.fat.value);
            }
        });
        this.echartsInstance.setOption(this.weightGraph);
    }


    ngOnChanges(changes: SimpleChanges) {
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }

}
