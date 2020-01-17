import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sleep } from '../models/sleep'
import { SearchForPeriod } from '../../measurement/models/measurement'
import { ActivatedRoute, Router } from '@angular/router'
import { DatePipe } from '@angular/common'
import { SleepService } from '../services/sleep.service'
import { TranslateService } from '@ngx-translate/core'
import { SleepPipe } from '../pipes/sleep.pipe'
import { DecimalFormatterPipe } from '../../measurement/pipes/decimal.formatter.pipe'
import { ToastrService } from 'ngx-toastr'
import * as echarts from 'echarts'
import { PageEvent } from '@angular/material/paginator'
import { ConfigurationBasic } from '../../config.matpaginator'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-sleep.list',
    templateUrl: './sleep.list.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class SleepListComponent implements OnInit {
    @Input() data: Array<Sleep>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    lastData: Sleep;
    options: any;
    echartSleepInstance: any;
    Math: any;
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
    /*In hours*/
    IDEAL_SLEEP_VALUE = 8;
    removingSleep: boolean;

    constructor(
        private activeRouter: ActivatedRoute,
        private datePipe: DatePipe,
        private decimalFormatter: DecimalFormatterPipe,
        private router: Router,
        private sleepService: SleepService,
        private sleepPipe: SleepPipe,
        private translateService: TranslateService,
        private toastService: ToastrService,
        private modalService: ModalService
    ) {
        this.Math = Math;
        this.data = new Array<Sleep>();
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

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.filterVisibility = true;
            this.includeCard = true;
            this.getAllSleeps();
        })
    }

    getAllSleeps(): void {
        this.showSpinner = true;
        this.sleepService.getAll(this.patientId)
            .then(httpResponse => {
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.loadGraph();
            })
            .catch(err => {
                console.log(err);
            })
    }

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.sleepService.getAll(this.patientId, null, null, filter)
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

    loadGraph() {
        const MAX_SLEEP_VALUE = 12;
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');
        const hours = this.translateService.instant('MYDATEPIPE.HOURS');
        const hours_abbreviation = this.translateService.instant('HABITS.SLEEP.TIME-ABBREVIATION');
        const duration = this.translateService.instant('ACTIVITY.SLEEP.DURATION');
        const title = this.translateService.instant('ACTIVITY.SLEEP.CLICK-TO-VIEW');
        const viewStages = this.translateService.instant('ACTIVITY.SLEEP.VIEW-STAGES');
        const and = this.translateService.instant('SHARED.AND');
        const minutes_abbreviation = this.translateService.instant('HABITS.SLEEP.MINUTES-ABBREVIATION');

        if (this.data.length > 1) {
            this.lastData = this.data[this.data.length - 1];
        } else {
            this.lastData = this.data[0];
        }

        const xAxis = { data: [] };
        const series = [
            {
                type: 'bar',
                barMaxWidth: 50,
                itemStyle: {
                    normal: { color: 'rgba(0,0,0,0.05)' }
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: [],
                animation: false
            },
            {
                type: 'bar',
                barMaxWidth: 50,
                label: {
                    show: true,
                    color: '#FFFFFF',
                    position: 'top',
                    distance: -30,
                    verticalAlign: 'middle',
                    rotate: 0,
                    formatter: function (params) {
                        const { data: { value } } = params;
                        return `${value.toFixed(1)}\n${hours_abbreviation}`
                    },
                    fontSize: 16
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#25c5b5' },
                                { offset: 0.5, color: '#00a594' },
                                { offset: 1, color: '#00a594' }
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#25c5b5' },
                                { offset: 0.7, color: '#00a594' },
                                { offset: 1, color: '#00a594' }
                            ]
                        )
                    }
                },
                data: [],
                markLine: {
                    silent: true,
                    data: [{
                        label: {
                            formatter: ''
                        },
                        yAxis: this.IDEAL_SLEEP_VALUE
                    }]
                }
            }
        ];

        this.data.forEach((element: Sleep) => {
            xAxis.data.push(this.datePipe.transform(element.start_time, 'shortDate'));
            series[0].data.push(MAX_SLEEP_VALUE);
            series[1].data.push({
                value: element.duration / 3600000,
                time: this.datePipe.transform(element.start_time, 'mediumTime')
            });
        });

        const yAxis = {
            min: 0,
            max: MAX_SLEEP_VALUE,
            axisLabel: {
                formatter: function (value) {
                    return `${value} ${hours_abbreviation}`
                }
            }
        }

        // for (let i = 0; i <= MAX_SLEEP_VALUE; i++) {
        //     i === IDEAL_SLEEP_VALUE ? yAxis.data.push({ value: i, label: `${i} ${hours}` }) : yAxis.data.push(i)
        // }

        this.options = {
            title: {
                subtext: title
            },
            tooltip: {
                formatter: function (params) {
                    const hours_trucate = Math.floor(params.data.value);
                    const minutes = Math.floor(((params.data.value * 3600000) % 3600000) / 60000);
                    return `${duration}: ${hours_trucate + hours_abbreviation} ${minutes ? and + ' '
                        + minutes + minutes_abbreviation : ''}  <br>` +
                        `${date}: <br> ${params.name} ${at} ${params.data.time}`;
                }
            },
            xAxis,
            yAxis,
            dataZoom: [
                {
                    type: 'slider'
                }
            ],
            series
        };

        this.initializeListChecks();
    }

    loadSleepGraph(selected: any): void {
        const sleepSelected: Sleep = this.data[selected.dataIndex];
        this.viewSleepDetails(sleepSelected.id);
    }

    viewSleepDetails(sleepId: string): void {
        this.router.navigate(['/app/activities', this.patientId, 'sleep', sleepId]);
    }

    updateGraph(measurements: Array<any>): void {
        const MAX_SLEEP_VALUE = 12;

        // clean weightGraph
        this.options.xAxis.data = [];
        this.options.series[0].data = [];
        this.options.series[1].data = [];

        measurements.forEach((element: Sleep) => {
            this.options.xAxis.data.push(this.datePipe.transform(element.start_time, 'shortDate'));
            this.options.series[0].data.push(MAX_SLEEP_VALUE);
            this.options.series[1].data.push({
                value: parseFloat(this.decimalFormatter.transform(element.duration / 3600000)),
                time: this.datePipe.transform(element.start_time, 'mediumTime')
            });
        });

        this.echartSleepInstance.setOption(this.options);
    }

    onSleepChartInit(event) {
        this.echartSleepInstance = event;
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

    closeModalConfirmation() {
        this.cacheIdMeasurementRemove = '';
        this.modalConfirmRemoveMeasurement = false;
        this.modalService.close('modalConfirmation');
    }

    loadMeasurements(): any {
        this.sleepService
            .getAll(this.patientId, this.page, this.limit, this.filter)
            .then((httpResponse) => {
                this.data = httpResponse.body;
                this.listIsEmpty = this.data.length === 0;
                this.initializeListChecks();
            })
            .catch(() => {
                this.listIsEmpty = true;
            });
    }

    openModalConfirmation(measurementId: string) {
        this.modalService.open('modalConfirmation');
        this.cacheIdMeasurementRemove = measurementId;
        // this.modalConfirmRemoveMeasurement = true;
    }

    initializeListChecks(): void {
        this.selectAll = false;
        this.listCheckMeasurements = new Array<boolean>(this.data.length);
        for (let i = 0; i < this.listCheckMeasurements.length; i++) {
            this.listCheckMeasurements[i] = false;
        }
        this.updateStateButtonRemoveSelected();
    }

    async removeMeasurement(): Promise<any> {
        this.modalService.close('modalConfirmation');
        this.loadingMeasurements = true;
        this.removingSleep = true;
        if (this.cacheIdMeasurementRemove) {
            this.sleepService.remove(this.patientId, this.cacheIdMeasurementRemove)
                .then(measurements => {
                    this.applyFilter(this.filter);
                    this.loadingMeasurements = false;
                    this.modalConfirmRemoveMeasurement = false;
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.SLEEP-REMOVED'));
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.SLEEP-NOT-REMOVED'));
                    this.loadingMeasurements = false;
                    this.modalConfirmRemoveMeasurement = false;
                    this.removingSleep = false;
                })
        } else {
            let occuredError = false;
            for (let i = 0; i < this.cacheListIdMeasurementRemove.length; i++) {
                try {
                    const measurementRemove = this.cacheListIdMeasurementRemove[i];
                    await this.sleepService.remove(this.patientId, measurementRemove);
                } catch (e) {
                    occuredError = true;
                }
            }
            occuredError ? this.toastService
                    .error(this.translateService.instant('TOAST-MESSAGES.SLEEP-NOT-REMOVED'))
                : this.toastService.info(this.translateService.instant('TOAST-MESSAGES.SLEEP-REMOVED'));

            this.applyFilter(this.filter);
            this.loadingMeasurements = false;
            this.removingSleep = false;
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
        // this.modalConfirmRemoveMeasurement = true;
        this.openModalConfirmation('')
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
