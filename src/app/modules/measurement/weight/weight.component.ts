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
    @Input() data: Array<Weight>;
    @Input() filterVisibility: boolean;
    @Input() includeCard: boolean;
    @Input() includeLogs: boolean;
    @Input() patientId: string;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    lastData: Weight;
    lastIndex: number;
    weightGraph: any;
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
        private decimalPipe: DecimalFormatterPipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private toastService: ToastrService
    ) {
        this.data = new Array<Weight>();
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

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.data = [];
        this.measurementService
            .getAllByUserAndType(this.patientId, EnumMeasurementType.WEIGHT, null, null, filter)
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

        this.initializeListCheckMeasurements();
    }

    loadMeasurements(): any {
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.WEIGHT, this.page, this.limit, this.filter)
            .then((httpResponse) => {
                this.data = httpResponse.body;
                this.listIsEmpty = this.data.length === 0;
                this.initializeListCheckMeasurements();
            })
            .catch(() => {
                this.listIsEmpty = true;
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
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
        }
    }

}
