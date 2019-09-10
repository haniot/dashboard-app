import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { EnumMeasurementType, Measurement, SearchForPeriod } from '../models/measurement';
import { DecimalFormatterPipe } from '../pipes/decimal.formatter.pipe';
import { Weight } from '../models/weight';
import { MeasurementService } from '../services/measurement.service';

@Component({
    selector: 'body-temperature',
    templateUrl: './body.temperature.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class BodyTemperatureComponent implements OnInit, OnChanges {
    @Input() data: Array<Measurement>;
    @Input() filter_visibility: boolean;
    @Input() patientId: string;
    lastData: Measurement;
    options: any;
    showSpinner: boolean;
    echartsInstance: any;

    constructor(
        private datePipe: DatePipe,
        private decimalPipe: DecimalFormatterPipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.data = new Array<Measurement>();
        this.lastData = new Measurement();
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

        const historic_temperature = this.translateService.instant('MEASUREMENTS.BODY-TEMPERATURE.TEMPERATURE-HISTORIC');
        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');
        const temperature = this.translateService.instant('MEASUREMENTS.BODY-TEMPERATURE.TEMPERATURE');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxis = {
            type: 'category',
            boundaryGap: false,
            data: []
        };

        const series = {
            name: historic_temperature,
            type: 'line',
            data: [],
            color: '#3F51B5',
            markPoint: {
                label: {
                    fontSize: 10,
                    formatter: function (params) {
                        if (params.data.type === 'max') {
                            return max;
                        }
                        if (params.data.type === 'min') {
                            return min;
                        }
                    }
                },
                data: [
                    { type: 'max' },
                    { type: 'min' }
                ]
            }
        };

        this.data.forEach((element: Measurement) => {
            xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            series.data.push({
                value: this.decimalPipe.transform(element.value),
                time: this.datePipe.transform(element.timestamp, 'mediumTime')
            });
        });


        this.options = {
            tooltip: {
                formatter: function (params) {
                    if (!params.data || !params.data.time) {
                        const t = series.data.find(currentHeight => {
                            return currentHeight.value.match(params.value);
                        });
                        if (t) {
                            params.data.value = t.value;
                            params.data.time = t.time;
                        }

                    }
                    return `${temperature}: ${params.data.value}°C<br>${date}:<br>${params.name} ${at} ${params.data.time}`
                },
                trigger: 'item'
            },
            xAxis: xAxis,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}°C'
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
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.body_temperature, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.updateGraph(this.data);
                this.showSpinner = false;
            })
            .catch(() => {
                this.showSpinner = false;
            });
    }

    updateGraph(measurements: Array<any>): void {
        // clean
        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((element: Weight) => {
            this.options.xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            this.options.series.data.push({
                value: element.value,
                time: this.datePipe.transform(element.timestamp, 'mediumTime')
            });
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
