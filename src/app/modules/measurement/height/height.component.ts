import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { EnumMeasurementType, Measurement } from '../models/measurement';
import { Weight } from '../models/weight';
import { MeasurementService } from '../services/measurement.service';
import { PageEvent } from '@angular/material'
import { ConfigurationBasic } from '../../config.matpaginator'
import { ToastrService } from 'ngx-toastr'
import { TimeSeriesIntervalFilter, TimeSeriesSimpleFilter } from '../../activity/models/time.series'

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
    @Output() remove: EventEmitter<{ type: EnumMeasurementType, resourceId: string | string[] }>;
    @Input() onlyGraph: boolean;
    @Input() filter: TimeSeriesIntervalFilter | TimeSeriesSimpleFilter;
    lastData: Measurement;
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
        private toastService: ToastrService
    ) {
        this.dataForGraph = new Array<Measurement>();
        this.dataForLogs = new Array<Measurement>();
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
        this.logsIsEmpty = false;
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

        const height = this.translateService.instant('MEASUREMENTS.HEIGHT.HEIGHT');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');
        const at = this.translateService.instant('SHARED.AT');

        if (!this.includeCard) {
            const length = this.dataForGraph ? this.dataForGraph.length : 0;
            this.lastData = length ? this.dataForGraph[length - 1] : new Measurement()
        }

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
                        if (params.data.type === 'max') {
                            return max;
                        }
                        if (params.data.type === 'min') {
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

        const yAxisMargin = this.onlyGraph ? -40 : 8;
        const gridX = this.onlyGraph ? '3%' : '5%';

        this.options = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if (!params.data || !params.data.time) {
                        const t = series.data.find(currentHeight => {
                            return currentHeight.value === params.data.value;
                        });
                        params.data.time = t.time;

                    }
                    return `${height}: ${params.data.value}cm <br> ${date}: <br> ${params.name} ${at} ${params.data.time}`;
                }
            },
            grid: [
                { x: gridX, y: '7%', width: '100%', height: '85%' }
            ],
            xAxis: xAxis,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}cm',
                    margin: yAxisMargin
                }
            },
            dataZoom: [{ type: 'inside' }],
            series: series
        };
    }

    applyFilter(filter: TimeSeriesIntervalFilter | TimeSeriesSimpleFilter) {
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
        this.options.yAxis.axisLabel.margin = this.onlyGraph ? -40 : 8;
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
        this.remove.emit({ type: EnumMeasurementType.height, resourceId: measurementId })
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
        this.remove.emit({ type: EnumMeasurementType.height, resourceId: measurementsIdSelected })
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
        if ((changes.dataForGraph && changes.dataForGraph.currentValue && changes.dataForGraph.previousValue
            && changes.dataForGraph.currentValue.length !== changes.dataForGraph.previousValue.length) ||
            (changes.dataForGraph && changes.dataForGraph.currentValue.length && !changes.dataForGraph.previousValue)) {
            this.loadGraph();
        }
        if ((changes.filter && changes.filter.currentValue && changes.filter.previousValue
            && changes.filter.currentValue !== changes.filter.previousValue) ||
            (changes.filter && changes.filter.currentValue && !changes.filter.previousValue)) {
            this.applyFilter(this.filter);
        }
        this.logsIsEmpty = this.dataForLogs.length === 0;
        this.initializeListCheckMeasurements();
    }
}
