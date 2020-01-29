import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { MeasurementService } from '../services/measurement.service';
import { BloodPressure } from '../models/blood.pressure';
import { EnumMeasurementType, SearchForPeriod } from '../models/measurement'
import { PageEvent } from '@angular/material'
import { ConfigurationBasic } from '../../config.matpaginator'
import { ToastrService } from 'ngx-toastr'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'blood-pressure',
    templateUrl: './blood.pressure.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './blood.pressure.component.scss']
})
export class BloodPressureComponent implements OnInit, OnChanges {
    @Input() data: Array<BloodPressure>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() includeLogs: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    lastData: BloodPressure;
    options: any;
    echartsInstance: any;

    listIsEmpty: boolean;
    filter: SearchForPeriod;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    loadingMeasurements: boolean;
    modalConfirmRemoveMeasurement: boolean;
    cacheIdMeasurementRemove: string;
    cacheListIdMeasurementRemove: Array<any>;
    selectAll: boolean;
    listCheckMeasurements: Array<boolean>;
    stateButtonRemoveSelected: boolean;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private toastService: ToastrService
    ) {
        this.data = new Array<BloodPressure>();
        this.filterVisibility = false;
        this.patientId = '';
        this.showSpinner = false;
        this.filterChange = new EventEmitter();
        this.listCheckMeasurements = new Array<boolean>();
        this.cacheListIdMeasurementRemove = new Array<string>();
        this.cacheIdMeasurementRemove = '';
        this.stateButtonRemoveSelected = false;
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.filter = new SearchForPeriod();
        this.loadingMeasurements = false;
        this.modalConfirmRemoveMeasurement = false;
        this.selectAll = false;
        this.listIsEmpty = false;
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
                        borderWidth: 1,
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
                        borderWidth: 1,
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
                        borderWidth: 1,
                        borderColor: 'white',
                        color: color_pulse
                    }
                }
            },
            { // For Hypotension
                type: 'bar',
                barMaxWidth: '50px',
                itemStyle: {
                    color: 'rgba(0,128,255,0.3)'
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: [],
                animation: true
            },
            { // For Normal
                type: 'bar',
                barMaxWidth: '50px',
                itemStyle: {
                    color: 'rgba(180,7,0,0.3)'
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: [],
                animation: true
            },
            { // For High
                type: 'bar',
                barMaxWidth: '50px',
                itemStyle: {
                    color: 'rgba(180,7,0,0.3)'
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: [],
                animation: true
            },
            { // For Stage 1
                type: 'bar',
                barMaxWidth: '50px',
                itemStyle: {
                    color: 'rgba(180,7,0,0.3)'
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: [],
                animation: true
            },
            { // For Stage 2
                type: 'bar',
                barMaxWidth: '50px',
                itemStyle: {
                    color: 'rgba(180,7,0,0.3)'
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: [],
                animation: true
            },
            { // For Urgency
                type: 'bar',
                barMaxWidth: '50px',
                itemStyle: {
                    color: 'rgba(180,7,0,0.3)'
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: [],
                animation: true
            },
            { // For Out of Range
                type: 'bar',
                barMaxWidth: '50px',
                itemStyle: {
                    color: 'rgba(0,0,0,0.2)'
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: [],
                animation: true
            }
        ]

        this.data.forEach((element: BloodPressure) => {
            const mediumTime = this.datePipe.transform(element.timestamp, 'mediumTime');

            xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            const result = this.classificate(element);
            series[0].data.push({
                value: element.systolic,
                time: mediumTime,
                classification: result.translate
            });

            series[1].data.push({
                value: element.diastolic,
                time: mediumTime
            });

            series[2].data.push({
                value: element.pulse,
                time: mediumTime
            });
            let index: number;
            switch (result.classification) {
                case 'hypotension':
                    index = 3;
                    break;
                case 'normal':
                    index = 4;
                    break;
                case 'high':
                    index = 5;
                    break;
                case 'stage1':
                    index = 6;
                    break;
                case 'stage2':
                    index = 7;
                    break;
                case 'urgency':
                    index = 8;
                    break;
                default: /* Out of Range*/
                    index = 9;
                    break;
            }
            this.options.series[index].data.push({
                value: 200
            });
        });

        this.options = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
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
            grid: [
                { x: '3%', y: '7%', width: '100%'}
            ],
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

        this.initializeListCheckMeasurements();
    }

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.blood_pressure, null, null, filter)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
                this.filterChange.emit(this.data);
            })
            .catch(() => {
                this.showSpinner = false;
            });
    }

    updateGraph(measurements: Array<any>): void {
        // clean
        this.options.xAxis.data = [];
        this.options.series.data = [];

        measurements.forEach((element: BloodPressure) => {
            const mediumTime = this.datePipe.transform(element.timestamp, 'mediumTime');
            this.options.xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            const result = this.classificate(element);

            this.options.series[0].data.push({
                value: element.systolic,
                time: mediumTime,
                classification: result.translate
            });
            this.options.series[1].data.push({
                value: element.diastolic,
                time: mediumTime
            });
            this.options.series[2].data.push({
                value: element.pulse,
                time: mediumTime
            });
            let index: number;
            switch (result.classification) {
                case 'hypotension':
                    index = 3;
                    break;
                case 'normal':
                    index = 4;
                    break;
                case 'high':
                    index = 5;
                    break;
                case 'stage1':
                    index = 6;
                    break;
                case 'stage2':
                    index = 7;
                    break;
                case 'urgency':
                    index = 8;
                    break;
                default: /* Out of Range*/
                    index = 9;
                    break;
            }
            this.options.series[index].data.push({
                value: 200
            });
        });
        this.echartsInstance.setOption(this.options);
    }

    classificate(measurement: BloodPressure): { classification: string, translate: string } {
        if (measurement.systolic < 90) {
            return {
                classification: 'hypotension',
                translate: this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.HYPOTENSION')
            };
        } else if (measurement.systolic < 120 && measurement.diastolic < 90) {
            return {
                classification: 'normal',
                translate: this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.NORMAL')
            };
        } else if (measurement.systolic >= 120 && measurement.systolic < 129 && measurement.diastolic < 80) {
            return {
                classification: 'high',
                translate: this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.HIGH')
            };
        } else if ((measurement.systolic >= 130 && measurement.systolic < 139) ||
            (measurement.diastolic >= 80 || measurement.diastolic < 90)) {
            return {
                classification: 'stage1',
                translate: this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.STAGE1')
            };
        } else if (measurement.systolic >= 140 || measurement.diastolic >= 90) {
            return {
                classification: 'stage2',
                translate: this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.STAGE2')
            };
        } else if (measurement.systolic >= 180 || measurement.diastolic >= 120) {
            return {
                classification: 'urgency',
                translate: this.translateService.instant('MEASUREMENTS.BLOOD-PRESSURE.HYPERTENSIVE-URGENCY')
            };
        } else {
            return {
                classification: 'out',
                translate: this.translateService.instant('MEASUREMENTS.PIPES.UNDEFINED')
            };
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.loadMeasurements();
    }

    changeOnMeasurement(): void {
        const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
        this.selectAll = this.data.length === measurementsSelected.length;
        this.updateStateButtonRemoveSelected();
    }

    closeModalConfimation() {
        this.cacheIdMeasurementRemove = '';
        this.modalConfirmRemoveMeasurement = false;
    }

    loadMeasurements(): any {
        this.measurementService
            .getAllByUserAndType(this.patientId, EnumMeasurementType.blood_pressure, this.page, this.limit, this.filter)
            .then((httpResponse) => {
                this.data = httpResponse.body;
                this.listIsEmpty = this.data.length === 0;
                this.initializeListCheckMeasurements();
            })
            .catch(() => {
                this.listIsEmpty = true;
            });
    }

    openModalConfirmation(measurementId: string) {
        this.cacheIdMeasurementRemove = measurementId;
        this.modalConfirmRemoveMeasurement = true;
    }

    initializeListCheckMeasurements(): void {
        this.selectAll = false;
        this.listCheckMeasurements = new Array<boolean>(this.data.length);
        for (let i = 0; i < this.listCheckMeasurements.length; i++) {
            this.listCheckMeasurements[i] = false;
        }
        this.updateStateButtonRemoveSelected();
    }

    async removeMeasurement(): Promise<any> {
        this.loadingMeasurements = true;
        if (!this.cacheListIdMeasurementRemove || !this.cacheListIdMeasurementRemove.length) {
            this.measurementService.remove(this.patientId, this.cacheIdMeasurementRemove)
                .then(measurements => {
                    this.applyFilter(this.filter);
                    this.loadingMeasurements = false;
                    this.modalConfirmRemoveMeasurement = false;
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-REMOVED'));
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-NOT-REMOVED'));
                    this.loadingMeasurements = false;
                    this.modalConfirmRemoveMeasurement = false;
                })
        } else {
            let occuredError = false;
            for (let i = 0; i < this.cacheListIdMeasurementRemove.length; i++) {
                try {
                    const measurementRemove = this.cacheListIdMeasurementRemove[i];
                    await this.measurementService.remove(this.patientId, measurementRemove.id);
                } catch (e) {
                    occuredError = true;
                }
            }
            occuredError ? this.toastService
                    .error(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-NOT-REMOVED'))
                : this.toastService.info(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-REMOVED'));

            this.applyFilter(this.filter);
            this.loadingMeasurements = false;
            this.modalConfirmRemoveMeasurement = false;
        }
    }

    removeSelected() {
        const measurementsIdSelected: Array<string> = new Array<string>();
        this.listCheckMeasurements.forEach((element, index) => {
            if (element) {
                measurementsIdSelected.push(this.data[index].id);
            }
        })
        this.cacheListIdMeasurementRemove = measurementsIdSelected;
        this.modalConfirmRemoveMeasurement = true;
    }

    selectAllMeasurements(): void {
        const attribSelectAll = (element: any) => {
            return !this.selectAll;
        }
        this.listCheckMeasurements = this.listCheckMeasurements.map(attribSelectAll);
        this.updateStateButtonRemoveSelected();
    }

    updateStateButtonRemoveSelected(): void {
        const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
        this.stateButtonRemoveSelected = !!measurementsSelected.length;
    }

    trackById(index, item) {
        return item.id;
    }

}
