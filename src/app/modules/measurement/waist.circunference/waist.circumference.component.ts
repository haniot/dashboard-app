import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { EnumMeasurementType, Measurement, SearchForPeriod } from '../models/measurement';
import { TranslateService } from '@ngx-translate/core';
import { Weight } from '../models/weight';
import { MeasurementService } from '../services/measurement.service';
import { PageEvent } from '@angular/material'
import { ConfigurationBasic } from '../../config.matpaginator'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'waist-circunference',
    templateUrl: './waist.circumference.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class WaistCircumferenceComponent implements OnInit, OnChanges {
    @Input() dataForGraph: Array<Measurement>;
    @Input() dataForLogs: Array<Measurement>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() includeLogs: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    @Output() remove: EventEmitter<{ type: EnumMeasurementType, resourceId: string | string[] }>;
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
    selectAll: boolean;
    listCheckMeasurements: Array<boolean>;
    stateButtonRemoveSelected: boolean;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService
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
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.waist_circumference, null, null, filter)
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

    onChartInit(event) {
        this.echartsInstance = event;
    }

    loadGraph() {

        const circumference = this.translateService.instant('MEASUREMENTS.WAIST-CIRCUMFERENCE.CIRCUMFERENCE');
        const average = this.translateService.instant('MEASUREMENTS.AVERAGE');
        const average_value = this.translateService.instant('MEASUREMENTS.AVERAGE-VALUE');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');

        if (!this.includeCard) {
            const length = this.dataForGraph ? this.dataForGraph.length : 0;
            this.lastData = length ? this.dataForGraph[length - 1] : new Measurement()
        }

        const xAxis = {
            type: 'category',
            data: [],
            axisTick: {
                alignWithLabel: true
            }
        };

        const series = {
            type: 'bar',
            barWidth: '60%',
            color: '#00a594',
            data: [],
            barMaxWidth: 100,
            markLine: {
                tooltip: {
                    trigger: 'item',
                    formatter: average_value + ' : {c}cm'
                },
                lineStyle: {
                    color: 'black'
                },
                data: [
                    { type: 'average', name: average }
                ]
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
            color: ['#3398DB'],
            tooltip: {
                formatter: function (params) {
                    return `${circumference}: ${params[0].data.value}cm` +
                        `<br ${date}: <br> ${params[0].name} ${at} ${params[0].data.time}`
                },
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: [
                { x: '5%', y: '7%', width: '100%' }
            ],
            xAxis: xAxis,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}cm'
                    }
                }
            ],
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series: series
        };

        this.initializeListCheckMeasurements();

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

    loadMeasurements(): any {
        this.logsLoading = true;
        this.dataForLogs = [];
        this.measurementService
            .getAllByUserAndType(this.patientId, EnumMeasurementType.waist_circumference, this.page, this.limit)
            .then((httpResponse) => {
                this.dataForLogs = httpResponse.body;
                this.lastData = httpResponse.body[0];
                this.logsIsEmpty = this.dataForLogs.length === 0;
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
        this.remove.emit({ type: EnumMeasurementType.waist_circumference, resourceId: measurementId });
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
        this.remove.emit({ type: EnumMeasurementType.waist_circumference, resourceId: measurementsIdSelected });
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
        this.logsIsEmpty = this.dataForLogs.length === 0;
        this.initializeListCheckMeasurements();
    }
}
