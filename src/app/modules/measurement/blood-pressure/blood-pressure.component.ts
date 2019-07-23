import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BloodPressure } from '../models/blood-pressure';
import { TranslateService } from '@ngx-translate/core';
import { MeasurementType } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';

@Component({
    selector: 'blood-pressure',
    templateUrl: './blood-pressure.component.html',
    styleUrls: ['../shared-style/shared-styles.scss', './blood-pressure.component.scss']
})
export class BloodPressureComponent implements OnInit, OnChanges {

    @Input() data: Array<BloodPressure>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;

    lastData: BloodPressure;

    options: any;

    showSpinner: boolean;

    echartsInstance: any;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.data = new Array<BloodPressure>();
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

    loadGraph() {

        const systolic = this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.SYSTOLIC');
        const diastolic = this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.DIASTOLIC');
        const pulse = this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.PULSE');
        const pressure = this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.PRESSURE');
        const date = this.translateService.instant('SHARED.DATE');

        const color_systolic = '#3F51B5';
        const color_diastolic = '#009688';
        const color_pulse = '#827717';

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
                        color: color_systolic,
                        width: 4,
                        type: ''
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 3,
                        borderColor: 'white',
                        color: color_systolic
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
                        color: color_diastolic,
                        width: 4,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 3,
                        borderColor: 'white',
                        color: color_diastolic
                    }
                }
            },
            {
                name: pulse,
                data: [],
                type: 'line',
                symbol: 'diamond',
                symbolSize: 20,
                lineStyle: {
                    normal: {
                        color: color_pulse,
                        width: 4,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 3,
                        borderColor: 'white',
                        color: color_pulse
                    }
                }
            }
        ]

        this.data.forEach((element: BloodPressure) => {
            const find = xAxis.data.find((ele) => {
                return ele === this.datePipe.transform(element.timestamp, 'shortDate');
            });

            if (!find) {
                xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
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
                formatter: function (params) {
                    let legend = '', unid = '';
                    switch (params.seriesName) {
                        case systolic:
                            legend = systolic;
                            unid = 'mmHg';
                            break;
                        case diastolic:
                            legend = diastolic;
                            unid = 'mmHg';
                            break;
                        case pulse:
                            legend = pulse;
                            unid = 'bpm';
                            break;
                    }
                    const tooltip = `${legend}: ${params.data}${unid}<br>` +
                        `${date}: ${params.name}`;
                    return tooltip;
                }
            },
            legend: {
                data: [systolic, diastolic, pulse]
            },
            xAxis: xAxis,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
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

    applyFilter(filter: { start_at: string, end_at: string, period: string }) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.blood_pressure, null, null, filter)
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
        // clean
        this.options.xAxis.data = new Array<any>();
        this.options.series.data = new Array<any>();

        measurements.forEach((element: BloodPressure) => {
            const find = this.options.xAxis.data.find((ele) => {
                return ele === this.datePipe.transform(element.timestamp, 'shortDate');
            });

            if (!find) {
                this.options.xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            }
            // Adicionando Sistólica
            this.options.series[0].data.push(element.systolic);

            // Adicionando Diastólica
            this.options.series[1].data.push(element.diastolic);

            // Adicionando Pulso
            this.options.series[2].data.push(element.pulse);
        });
        this.echartsInstance.setOption(this.options);
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }

}
