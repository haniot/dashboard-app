import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { MeasurementService } from '../services/measurement.service';
import { BloodPressure } from '../models/blood-pressure';
import { EnumMeasurementType, SearchForPeriod } from '../models/measurement'

@Component({
    selector: 'blood-pressure',
    templateUrl: './blood.pressure.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './blood.pressure.component.scss']
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
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');
        const classification = this.translateService.instant('SHARED.CLASSIFICATION');

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
                // markLine: {
                //     silent: true,
                //     data: [{
                //         label: {
                //             formatter: hypotension,
                //             position: 'middle'
                //         },
                //         yAxis: 90
                //     }, {
                //         label: {
                //             formatter: normal,
                //             position: 'middle'
                //         },
                //         yAxis: 120
                //     }, {
                //         label: {
                //             formatter: high,
                //             position: 'middle'
                //         },
                //         yAxis: 130
                //     }, {
                //         label: {
                //             formatter: stage1,
                //             position: 'middle'
                //         },
                //         yAxis: 140
                //     }, {
                //         label: {
                //             formatter: stage2,
                //             position: 'middle'
                //         },
                //         yAxis: 180
                //     }, {
                //         label: {
                //             formatter: hypertensiveUrgency,
                //             position: 'middle'
                //         },
                //         yAxis: 180
                //     }]
                // }
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
                // markLine: {
                //     silent: true,
                //     data: [{
                //         label: {
                //             formatter: ' Hipotensão'
                //         },
                //         yAxis: 50
                //     }, {
                //         label: {
                //             formatter: ' Normal'
                //         },
                //         yAxis: 70
                //     }, {
                //         label: {
                //             formatter: ' Elevada'
                //         },
                //         yAxis: 80
                //     }, {
                //         label: {
                //             formatter: 'Estágio 1'
                //         },
                //         yAxis: 90
                //     }, {
                //         label: {
                //             formatter: 'Estágio 2'
                //         },
                //         yAxis: 120
                //     }, {
                //         label: {
                //             formatter: 'Urgência Hipertensiva'
                //         },
                //         yAxis: 180
                //     }]
                // }
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
            const mediumTime = this.datePipe.transform(element.timestamp, 'mediumTime');

            xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));

            series[0].data.push({
                value: element.systolic,
                time: mediumTime,
                classification: this.classificate(element)
            });

            series[1].data.push({
                value: element.diastolic,
                time: mediumTime
            });

            series[2].data.push({
                value: element.pulse,
                time: mediumTime
            });
        });

        this.options = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    // let legend = '', unid = '';
                    // switch (params.seriesName) {
                    //     case systolic:
                    //         legend = systolic;
                    //         unid = 'mmHg';
                    //         break;
                    //     case diastolic:
                    //         legend = diastolic;
                    //         unid = 'mmHg';
                    //         break;
                    //     case pulse:
                    //         legend = pulse;
                    //         unid = 'bpm';
                    //         break;
                    // }
                    // const tooltip = `${legend}: ${params.data.value}${unid}<br>` +
                    //     `${date}:<br>${params.name} ${at} ${params.data.time}`;
                    // return tooltip;

                    return `${params[0].seriesName}: ${params[0].value}${params[0].seriesName !== pulse ? 'mmHg' : 'bpm'}<br>` +
                        `${params[1].seriesName}: ${params[1].value}${params[1].seriesName !== pulse ? 'mmHg' : 'bpm'}<br>` +
                        `${params[2].seriesName}: ${params[1].value}${params[2].seriesName !== pulse ? 'mmHg' : 'bpm'}<br>` +
                        `${classification}: ${params[0].data.classification}<br>` +
                        `${date}:<br>${params[0].axisValue} ${at} ${params[0].data.time}`;
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

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.blood_pressure, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
            })
            .catch();
    }

    updateGraph(measurements: Array<any>): void {
        // clean
        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((element: BloodPressure) => {
            const mediumTime = this.datePipe.transform(element.timestamp, 'mediumTime');
            this.options.xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            this.options.series[0].data.push({
                value: element.systolic,
                time: mediumTime
            });
            this.options.series[1].data.push({
                value: element.diastolic,
                time: mediumTime
            });
            this.options.series[2].data.push({
                value: element.pulse,
                time: mediumTime
            });
        });
        this.echartsInstance.setOption(this.options);
    }

    classificate(measurement: BloodPressure): string {
        if (measurement.systolic < 90) {
            return this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.HYPOTENSION');
        } else if (measurement.systolic < 120 && measurement.diastolic < 90) {
            return this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.NORMAL');
        } else if (measurement.systolic >= 120 && measurement.systolic < 129 && measurement.diastolic < 80) {
            return this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.HIGH');
        } else if ((measurement.systolic >= 130 && measurement.systolic < 139) ||
            (measurement.diastolic >= 80 || measurement.diastolic < 90)) {
            return this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.STAGE1');
        } else if (measurement.systolic >= 140 || measurement.diastolic >= 90) {
            return this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.STAGE2');
        } else if (measurement.systolic >= 180 || measurement.diastolic >= 120) {
            return this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.HYPERTENSIVE-URGENCY');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }

}
