import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { MeasurementService } from '../services/measurement.service';
import { BloodPressure } from '../models/blood.pressure';
import { EnumMeasurementType } from '../models/measurement'
import { PageEvent } from '@angular/material'
import { ConfigurationBasic } from '../../config.matpaginator'
import { ToastrService } from 'ngx-toastr'
import { TimeSeriesIntervalFilter, TimeSeriesSimpleFilter } from '../../activity/models/time.series'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'blood-pressure',
    templateUrl: './blood.pressure.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './blood.pressure.component.scss']
})
export class BloodPressureComponent implements OnInit, OnChanges {
    @Input() dataForGraph: Array<BloodPressure>;
    @Input() dataForLogs: Array<BloodPressure>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() includeLogs: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    @Output() remove: EventEmitter<{ type: EnumMeasurementType, resourceId: string | string[] }>;
    @Input() onlyGraph: boolean;
    @Input() filter: TimeSeriesIntervalFilter | TimeSeriesSimpleFilter;
    @Input() intraday: boolean;
    EnumMeasurementType = EnumMeasurementType;
    lastData: BloodPressure;
    options: any;
    echartsInstance: any;
    logsIsEmpty: boolean;
    logsLoading: boolean;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    loadingMeasurements: boolean;
    selectAll: boolean;
    listCheckMeasurements: Array<boolean>;
    stateButtonRemoveSelected: boolean;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private modalService: ModalService
    ) {
        this.dataForGraph = new Array<BloodPressure>();
        this.dataForLogs = new Array<BloodPressure>();
        this.filterVisibility = false;
        this.patientId = '';
        this.showSpinner = false;
        this.filterChange = new EventEmitter();
        this.listCheckMeasurements = new Array<boolean>();
        this.stateButtonRemoveSelected = false;
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.filter = new TimeSeriesIntervalFilter();
        this.loadingMeasurements = false;
        this.selectAll = false;
        this.remove = new EventEmitter<{ type: EnumMeasurementType, resourceId: string | string[] }>();
    }

    ngOnInit(): void {
        this.loadGraph();
        if (this.includeCard) {
            this.loadMeasurements();
        }
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

        if (!this.includeCard) {
            const length = this.dataForGraph ? this.dataForGraph.length : 0;
            this.lastData = length ? this.dataForGraph[length - 1] : new BloodPressure()
        }

        const color_systolic = '#3F51B5';
        const color_diastolic = '#009688';
        const color_pulse = '#827717';

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
                    color: 'rgba(25,142,125,0.3)'
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
                    color: 'rgba(252,204,0,0.3)'
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
                    color: 'rgba(254,143,2,0.3)'
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
                    color: 'rgba(249,82,1,0.3)'
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
                    color: 'rgba(255,1,0,0.5)'
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
        const values = this.dataForGraph.map(element => {
            return element.value
        })
        let max = 0;
        if (values && values.length) {
            max = values.reduce((a, b) => {
                return Math.max(a, b)
            })
        }

        this.dataForGraph.forEach((element: BloodPressure) => {
            const mediumTime = this.datePipe.transform(element.timestamp, 'mediumTime');
            const format = this.intraday ? 'mediumTime' : 'shortDate';
            xAxis.data.push(this.datePipe.transform(element.timestamp, format));
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
            switch (result.classification) {
                case 'hypotension':
                    this.setMax(3, max);
                    break;
                case 'normal':
                    this.setMax(4, max);
                    break;
                case 'high':
                    this.setMax(5, max);
                    break;
                case 'stage1':
                    this.setMax(6, max);
                    break;
                case 'stage2':
                    this.setMax(7, max);
                    break;
                case 'urgency':
                    this.setMax(8, max);
                    break;
                default: /* Out of Range*/
                    this.setMax(9, max);
                    break;
            }
        });

        const yAxisMargin = this.onlyGraph ? -35 : 8;

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
                { x: '3%', y: '7%', width: '100%', height: '85%' }
            ],
            xAxis: xAxis,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    margin: yAxisMargin
                }
            },
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: series
        };
    }

    applyFilter(filter: any) {
        this.intraday = filter['type'] && filter['type'] === 'today';
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.blood_pressure, null, null, filter)
            .then(httpResponse => {
                this.dataForGraph = httpResponse.body;
                this.showSpinner = false;
                if (this.dataForGraph && this.dataForGraph.length) {
                    this.dataForGraph = this.dataForGraph.reverse();
                }
                this.updateGraph(this.dataForGraph);
                this.filterChange.emit(this.dataForGraph);
            })
            .catch(() => {
                this.showSpinner = false;
            });
    }

    updateGraph(measurements: Array<any>): void {
        // clean
        this.options.yAxis.axisLabel.margin = this.onlyGraph ? -35 : 8;
        this.options.xAxis.data = [];
        this.options.series.dataForGraph = [];

        const values = this.dataForGraph.map(element => {
            return Math.max(Math.max(element.systolic, element.diastolic), element.pulse)
        })
        let max = 0;
        if (values && values.length) {
            max = values.reduce((a, b) => {
                return Math.max(a, b)
            })
        }

        measurements.forEach((element: BloodPressure, i) => {
            const mediumTime = this.datePipe.transform(element.timestamp, 'mediumTime');
            const format = this.intraday ? 'mediumTime' : 'shortDate';
            this.options.xAxis.data.push(this.datePipe.transform(element.timestamp, format));
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
            switch (result.classification) {
                case 'hypotension':
                    this.setMax(3, max);
                    break;
                case 'normal':
                    this.setMax(4, max);
                    break;
                case 'high':
                    this.setMax(5, max);
                    break;
                case 'stage1':
                    this.setMax(6, max);
                    break;
                case 'stage2':
                    this.setMax(7, max);
                    break;
                case 'urgency':
                    this.setMax(8, max);
                    break;
                default: /* Out of Range*/
                    this.setMax(9, max);
                    break;
            }
        });
        this.echartsInstance.setOption(this.options);
    }

    setMax(index, max): void {
        if (this.options && this.options.series) {
            for (let i = 3; i <= 9; i++) {
                if (i === index) {
                    this.options.series[i].data.push({ value: max });
                } else {
                    this.options.series[i].data.push({ value: 0 });
                }

            }
        }
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

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.loadMeasurements();
    }

    changeOnMeasurement(): void {
        const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
        this.selectAll = this.dataForGraph.length === measurementsSelected.length;
        this.updateStateButtonRemoveSelected();
    }

    loadMeasurements(): any {
        this.logsLoading = true;
        this.dataForLogs = [];
        this.measurementService
            .getAllByUserAndType(this.patientId, EnumMeasurementType.blood_pressure, this.page, this.limit)
            .then((httpResponse) => {
                this.dataForLogs = httpResponse.body;
                this.logsIsEmpty = this.dataForLogs.length === 0;
                if (this.dataForLogs && this.dataForLogs.length) {
                    this.lastData = this.dataForLogs[0];
                }
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                this.initializeListCheckMeasurements();
                this.logsLoading = false;
            })
            .catch(() => {
                this.logsLoading = false;
                this.logsIsEmpty = true;
                this.lastData = new BloodPressure();
            });
    }

    openModalConfirmation(measurementId: string) {
        this.remove.emit({ type: EnumMeasurementType.blood_pressure, resourceId: measurementId });
    }

    openModalNewMeasurement(): void {
        this.modalService.open('newMeasurement');
    }

    initializeListCheckMeasurements(): void {
        this.selectAll = false;
        this.listCheckMeasurements = new Array<boolean>(this.dataForLogs.length);
        for (let i = 0; i < this.listCheckMeasurements.length; i++) {
            this.listCheckMeasurements[i] = false;
        }
        this.updateStateButtonRemoveSelected();
    }

    removeSelected() {
        const measurementsIdSelected: Array<string> = new Array<string>();
        this.listCheckMeasurements.forEach((element, index) => {
            if (element) {
                measurementsIdSelected.push(this.dataForLogs[index].id);
            }
        })
        this.remove.emit({ type: EnumMeasurementType.blood_pressure, resourceId: measurementsIdSelected });
    }

    selectAllMeasurements(): void {
        const attribSelectAll = (element: any) => {
            return !this.selectAll;
        }
        this.listCheckMeasurements = this.listCheckMeasurements.map(attribSelectAll);
        this.updateStateButtonRemoveSelected();
    }

    savedSuccessfully(): void {
        this.loadMeasurements();
        this.applyFilter(this.filter);
    }

    updateStateButtonRemoveSelected(): void {
        const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
        this.stateButtonRemoveSelected = !!measurementsSelected.length;
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.dataForGraph && changes.dataForGraph.currentValue && changes.dataForGraph.previousValue
            && changes.dataForGraph.currentValue.length !== changes.dataForGraph.previousValue.length) ||
            (changes.dataForGraph && changes.dataForGraph.currentValue.length && !changes.dataForGraph.previousValue)) {
            this.loadGraph();
        }
        if ((changes.filter && changes.filter.currentValue && changes.filter.previousValue
            && changes.filter.currentValue !== changes.filter.previousValue) ||
            (changes.filter && changes.filter.currentValue && !changes.filter.previousValue)) {
            if (!this.filter['type']) {
                const type = this.filter['interval'] ? 'today' : '';
                this.applyFilter({ type, filter: this.filter });
            } else {
                this.applyFilter(this.filter);
            }
        }
        this.logsIsEmpty = this.dataForLogs.length === 0;
        this.initializeListCheckMeasurements();
    }

}
