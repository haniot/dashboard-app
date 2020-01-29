import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material'
import { ToastrService } from 'ngx-toastr'

import { Weight } from '../models/weight';
import { DecimalFormatterPipe } from '../pipes/decimal.formatter.pipe';
import { MeasurementService } from '../services/measurement.service';
import { EnumMeasurementType, SearchForPeriod } from '../models/measurement';
import { ConfigurationBasic } from '../../config.matpaginator';

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'weight',
    templateUrl: './weight.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class WeightComponent implements OnInit, OnChanges {
    @Input() dataForGraph: Array<Weight>;
    @Input() dataForLogs: Array<Weight>;
    @Input() filterVisibility: boolean;
    @Input() includeCard: boolean;
    @Input() includeLogs: boolean;
    @Input() patientId: string;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    lastData: Weight;
    weightGraph: any;
    echartsInstance: any;
    logsIsEmpty: boolean;
    logsLoading: boolean;
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
        private decimalPipe: DecimalFormatterPipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private toastService: ToastrService
    ) {
        this.dataForGraph = new Array<Weight>();
        this.dataForLogs = new Array<Weight>();
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
        this.limit = 1;
        this.filter = new SearchForPeriod();
        this.loadingMeasurements = false;
        this.modalConfirmRemoveMeasurement = false;
        this.selectAll = false;
    }

    ngOnInit(): void {
        this.loadGraph();
        this.loadMeasurements();
    }

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.dataForGraph = [];
        this.measurementService
            .getAllByUserAndType(this.patientId, EnumMeasurementType.weight, null, null, filter)
            .then(httpResponse => {
                this.dataForGraph = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.dataForGraph);
                this.filterChange.emit(this.dataForGraph);
            })
            .catch(() => {
                this.showSpinner = false;
            });
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

    closeModalConfimation() {
        this.cacheIdMeasurementRemove = '';
        this.modalConfirmRemoveMeasurement = false;
    }

    loadGraph(): any {
        const weigth = this.translateService.instant('MEASUREMENTS.WEIGHT.TITLE');
        const body_fat = this.translateService.instant('MEASUREMENTS.WEIGHT.BODY-FAT');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

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

        this.dataForGraph.forEach((element: Weight) => {
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
                            `: ${params.dataForGraph.value}Kg <br> ${date}: <br> ${params.name} ${at} ${params.dataForGraph.time}`;
                    }
                    return body_fat +
                        `: ${params.dataForGraph.value}% <br> ${date}: <br> ${params.name} ${at} ${params.dataForGraph.time}`;
                }
            },
            grid: [
                { x: '3%', y: '7%', width: '100%' }
            ],
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

        this.initializeListCheckMeasurements();
    }

    loadMeasurements(): any {
        this.logsLoading = true;
        this.dataForLogs = [];
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.weight, this.page, this.limit)
            .then((httpResponse) => {
                this.dataForLogs = httpResponse.body;
                this.logsIsEmpty = this.dataForLogs.length === 0;
                this.lastData = this.dataForLogs[0];
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                this.initializeListCheckMeasurements();
                this.logsLoading = false;
            })
            .catch(() => {
                this.logsLoading = false;
                this.logsIsEmpty = true;
                this.lastData = new Weight();
            });
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    openModalConfirmation(measurementId: string) {
        this.cacheIdMeasurementRemove = measurementId;
        this.modalConfirmRemoveMeasurement = true;
    }

    initializeListCheckMeasurements(): void {
        this.selectAll = false;
        this.listCheckMeasurements = new Array<boolean>(this.dataForLogs.length);
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
                measurementsIdSelected.push(this.dataForGraph[index].id);
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

    updateStateButtonRemoveSelected(): void {
        const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
        this.stateButtonRemoveSelected = !!measurementsSelected.length;
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.dataForGraph.currentValue && changes.dataForGraph.previousValue
            && changes.dataForGraph.currentValue.length !== changes.dataForGraph.previousValue.length) ||
            (changes.dataForGraph.currentValue.length && !changes.dataForGraph.previousValue)) {
            this.loadGraph();
        }
    }

}
