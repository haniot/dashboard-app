import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { EnumMeasurementType, Measurement, SearchForPeriod } from '../models/measurement';
import { Weight } from '../models/weight';
import { MeasurementService } from '../services/measurement.service';
import { PageEvent } from '@angular/material'
import { ConfigurationBasic } from '../../config.matpaginator'
import { ToastrService } from 'ngx-toastr'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'height',
    templateUrl: './height.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class HeightComponent implements OnInit, OnChanges {
    @Input() dataForGraph: Array<Measurement>;
    @Input() dataForLogs: Array<Measurement>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() includeLogs: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    lastData: Measurement;
    options: any;
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
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private toastService: ToastrService
    ) {
        this.dataForGraph = new Array<Measurement>();
        this.dataForLogs = new Array<Measurement>();
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
        this.logsIsEmpty = false;
    }

    ngOnInit(): void {
        this.loadGraph();
        this.loadMeasurements();
    }

    onChartInit(event) {
        this.echartsInstance = event;
    }

    loadGraph() {

        const height = this.translateService.instant('MEASUREMENTS.HEIGHT.HEIGHT');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');
        const at = this.translateService.instant('SHARED.AT');

        const xAxis = {
            type: 'category',
            data: []
        };

        const series = {
            name: height,
            type: 'line',
            step: 'start',
            data: [],
            color: '#3F51B5',
            markPoint: {
                label: {
                    fontSize: 10,
                    formatter: function (params) {
                        if (params.dataForGraph.type === 'max') {
                            return max;
                        }
                        if (params.dataForGraph.type === 'min') {
                            return min;
                        }
                    }
                },
                data: [{ type: 'max' }, { type: 'min' }]
            }
        };

        this.dataForGraph.forEach((element: Measurement) => {
            xAxis.data.push(this.datePipe.transform(element.timestamp, 'shortDate'));
            series.data.push({
                value: element.value,
                time: this.datePipe.transform(element.timestamp, 'mediumTime')
            });
        });


        this.options = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if (!params.dataForGraph || !params.dataForGraph.time) {
                        const t = series.data.find(currentHeight => {
                            return currentHeight.value === params.dataForGraph.value;
                        });
                        params.dataForGraph.time = t.time;

                    }
                    return `${height}: ${params.dataForGraph.value}cm <br> ${date}: <br> ${params.name} ${at} ${params.dataForGraph.time}`;
                }
            },
            grid: [
                { x: '5%', y: '7%', width: '100%' }
            ],
            xAxis: xAxis,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}cm'
                }
            },
            dataZoom: [{ type: 'slider' }],
            series: series
        };

        this.initializeListCheckMeasurements();
    }

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.height, null, null, filter)
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

    updateGraph(measurements: Array<any>): void {
        // clean weightGraph
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

    loadMeasurements(): any {
        this.logsLoading = true;
        this.dataForLogs = [];
        this.measurementService
            .getAllByUserAndType(this.patientId, EnumMeasurementType.height, this.page, this.limit)
            .then((httpResponse) => {
                this.dataForLogs = httpResponse.body;
                this.logsIsEmpty = this.dataForLogs.length === 0;
                this.lastData = httpResponse.body[0];
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                this.initializeListCheckMeasurements();
                this.logsLoading = false;
            })
            .catch(() => {
                this.logsLoading = false;
                this.logsIsEmpty = true;
                this.lastData = new Measurement();
            });
    }

    openModalConfirmation(measurementId: string) {
        this.cacheIdMeasurementRemove = measurementId;
        this.modalConfirmRemoveMeasurement = true;
    }

    initializeListCheckMeasurements(): void {
        this.selectAll = false;
        this.listCheckMeasurements = new Array<boolean>(this.dataForGraph.length);
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
