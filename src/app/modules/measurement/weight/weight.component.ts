import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { Weight } from '../models/weight';
import { DecimalFormatterPipe } from '../pipes/decimal.formatter.pipe';
import { MeasurementService } from '../services/measurement.service';
import { EnumMeasurementType, SearchForPeriod } from '../models/measurement'

@Component({
    selector: 'weight',
    templateUrl: './weight.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
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
        this.patientId = '';
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
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

        this.lastIndex = 0;

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

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

        const xAxisFat = { type: 'category', data: [] };

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
            xAxisWeight.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            seriesWeight.data.push({
                value: this.decimalPipe.transform(element.value),
                time: this.datePipe.transform(element.timestamp, 'mediumTime')
            });
            if (element.body_fat) {
                xAxisFat.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
                seriesFat.data.push({
                    value: element.body_fat,
                    time: this.datePipe.transform(element.timestamp, 'mediumTime')
                });
            }
        });

        this.weightGraph = {
            tooltip: {
                formatter: function (params) {
                    if (params.seriesName === weigth) {
                        return weigth +
                            `: ${params.data.value}Kg <br> ${date}: <br> ${params.name} ${at} ${params.data.time}`;
                    }
                    return body_fat +
                        `: ${params.data.value}% <br> ${date}: <br> ${params.name} ${at} ${params.data.time}`;
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

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.weight, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
            })
            .catch(() => {
                this.showSpinner = false;
            });
    }

    updateGraph(measurements: Array<any>): void {
        // clean weightGraph
        this.weightGraph.xAxis.data = new Array<any>();
        this.weightGraph.series[0].data = [];
        this.weightGraph.series[1].data = [];

        measurements.forEach((element: Weight) => {
            this.weightGraph.xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            this.weightGraph.series[0].data.push({
                value: this.decimalPipe.transform(element.value),
                time: this.datePipe.transform(element.timestamp, 'mediumTime')
            });
            if (element.body_fat) {
                this.weightGraph.xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
                this.weightGraph.series[1].data.push({
                    value: element.body_fat,
                    time: this.datePipe.transform(element.timestamp, 'mediumTime')
                });
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
