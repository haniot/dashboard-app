import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material'

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
    @Input() onlyGraph: boolean;
    @Output() filterChange: EventEmitter<any>;
    @Output() remove: EventEmitter<{ type: EnumMeasurementType, resourceId: string | string[] }>;
    @Input() filter: SearchForPeriod;
    logsIsEmpty: boolean;
    lastData: Weight;
    weightGraph: any;
    echartsInstance: any;
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
        private decimalPipe: DecimalFormatterPipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
    ) {
        this.dataForGraph = new Array<Weight>();
        this.dataForLogs = new Array<Weight>();
        this.filterVisibility = false;
        this.patientId = '';
        this.showSpinner = false;
        this.filterChange = new EventEmitter();
        this.listCheckMeasurements = new Array<boolean>();
        this.stateButtonRemoveSelected = false;
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.filter = new SearchForPeriod();
        this.loadingMeasurements = false;
        this.selectAll = false;
        this.remove = new EventEmitter<{ type: EnumMeasurementType, resourceId: string }>();
    }

    ngOnInit(): void {
        this.loadGraph();
        if (this.includeCard) {
            this.loadMeasurements();
        }
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

    loadGraph(): any {
        const weigth = this.translateService.instant('MEASUREMENTS.WEIGHT.TITLE');
        const body_fat = this.translateService.instant('MEASUREMENTS.WEIGHT.BODY-FAT');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

        if (!this.includeCard) {
            const length = this.dataForGraph ? this.dataForGraph.length : 0;
            this.lastData = length ? this.dataForGraph[length - 1] : new Weight()
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

        const yAxisMargin = this.onlyGraph ? -20 : 8;

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
            grid: [
                { x: '3%', y: '7%', width: '100%', height: '86%' }
            ],
            xAxis: xAxisWeight,
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}',
                    margin: yAxisMargin
                }
            },
            legend: {
                data: [weigth, body_fat]
            },
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: [
                seriesWeight,
                seriesFat
            ]
        };
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
        this.remove.emit({ type: EnumMeasurementType.weight, resourceId: measurementId })
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
        this.remove.emit({ type: EnumMeasurementType.weight, resourceId: measurementsIdSelected })
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
        this.weightGraph.yAxis.axisLabel.margin = this.onlyGraph ? -20 : 8;
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
