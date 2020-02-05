import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sleep } from '../models/sleep'
import { ActivatedRoute, Router } from '@angular/router'
import { DatePipe } from '@angular/common'
import { SleepFilter, SleepService } from '../services/sleep.service'
import { TranslateService } from '@ngx-translate/core'
import { SleepPipe } from '../pipes/sleep.pipe'
import { DecimalFormatterPipe } from '../../measurement/pipes/decimal.formatter.pipe'
import { ToastrService } from 'ngx-toastr'
import * as echarts from 'echarts'
import { PageEvent } from '@angular/material/paginator'
import { ConfigurationBasic } from '../../config.matpaginator'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { TimeSeriesIntervalFilter, TimeSeriesSimpleFilter } from '../models/time.series'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-sleep.list',
    templateUrl: './sleep.list.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class SleepListComponent implements OnInit {
    @Input() listForGraph: Array<Sleep>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    listForLogs: Array<Sleep>;
    lastData: Sleep;
    options: any;
    echartSleepInstance: any;
    Math: any;
    listGraphIsEmpty: boolean;
    listLogsIsEmpty: boolean;
    filter: TimeSeriesIntervalFilter | TimeSeriesSimpleFilter;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    loadingSleeps: boolean;
    cacheListIdSleepRemove: Array<any>;
    selectAll: boolean;
    listCheckSleeps: Array<boolean>;
    stateButtonRemoveSelected: boolean;
    /*In hours*/
    IDEAL_SLEEP_VALUE = 8;
    removingSleep: boolean;
    showSpinnerLogs: boolean;

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
        this.listForGraph = new Array<Sleep>();
        this.listForLogs = new Array<Sleep>();
        this.filterVisibility = false;
        this.patientId = '';
        this.showSpinner = false;
        this.filterChange = new EventEmitter();
        this.listCheckSleeps = new Array<boolean>();
        this.cacheListIdSleepRemove = new Array<string>();
        this.stateButtonRemoveSelected = false;
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.filter = new TimeSeriesIntervalFilter();
        this.loadingSleeps = false;
        this.selectAll = false;
        this.listGraphIsEmpty = false;
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.filterVisibility = true;
            this.includeCard = true;
            this.getAllSleeps();
            this.getAllSleepsForLogs();
        })
    }

    getAllSleeps(): void {
        this.showSpinner = true;
        const currentDate = new Date();
        const start_time = currentDate.toISOString().split('T')[0] + 'T03:00:00.000Z';
        const nextday: Date = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000));
        const end_time = nextday.toISOString().split('T')[0] + 'T02:59:59.000Z';
        const filter = new SleepFilter('today', start_time, end_time);
        this.sleepService.getAll(this.patientId, null, null, filter)
            .then(httpResponse => {
                this.listForGraph = httpResponse.body;
                this.showSpinner = false;
                this.listForGraph.reverse();
                this.loadGraph();
            })
            .catch(err => {
                console.log(err);
                this.showSpinner = false;
            })
    }

    getAllSleepsForLogs(): void {
        this.showSpinnerLogs = true;
        this.listForLogs = [];
        this.sleepService.getAll(this.patientId, this.page, this.limit)
            .then(httpResponse => {
                this.listForLogs = httpResponse && httpResponse.body ? httpResponse.body : [];
                this.length = httpResponse && httpResponse.headers ? parseInt(httpResponse.headers.get('x-total-count'), 10) : 0;
                this.showSpinnerLogs = false;
                if (this.listForLogs.length > 1) {
                    this.lastData = this.listForLogs[this.listForLogs.length - 1];
                    this.listForLogs = this.listForLogs.reverse();
                } else {
                    this.lastData = this.listForLogs[0];
                }
                this.initializeListChecks();
            })
            .catch(err => {
                this.showSpinnerLogs = false;
            })
    }

    applyFilter(event: any) {
        this.showSpinner = true;
        let filter: SleepFilter;
        let start_time: string;
        let nextday: Date;
        let end_time: string;
        if (event.type === 'today') {
            start_time = event.filter.date + 'T03:00:00.000Z';
            nextday = new Date(new Date(event.filter.date).getTime() + (24 * 60 * 60 * 1000));
            end_time = nextday.toISOString().split('T')[0] + 'T02:59:59.000Z';
        } else {
            start_time = event.filter.start_date + 'T03:00:00.000Z';
            nextday = new Date(new Date(event.filter.end_date).getTime() + (24 * 60 * 60 * 1000));
            end_time = nextday.toISOString().split('T')[0] + 'T02:59:59.000Z';
        }
        filter = new SleepFilter(event.type, start_time, end_time)
        this.sleepService.getAll(this.patientId, null, null, filter)
            .then(httpResponse => {
                this.listForGraph = httpResponse.body;
                this.listForGraph.reverse();
                this.showSpinner = false;
                this.updateGraph(this.listForGraph);
                this.filterChange.emit(this.listForGraph);
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
        const period = this.translateService.instant('MEASUREMENTS.MEASUREMENT-CARD.PERIOD');

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
                        // return `${value.toFixed(1)}\n${hours_abbreviation}`
                        return '';
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

        this.listForGraph.forEach((element: Sleep) => {
            xAxis.data.push(this.datePipe.transform(element.start_time, 'shortDate'));
            series[0].data.push(MAX_SLEEP_VALUE);
            series[1].data.push({
                value: element.duration / 3600000,
                start_time: this.datePipe.transform(element.start_time, 'mediumTime'),
                end_time: this.datePipe.transform(element.end_time, 'mediumTime')
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
                    return `${params.name}<br>${duration}: ${hours_trucate + hours_abbreviation} ${minutes ? and + ' '
                        + minutes + minutes_abbreviation : ''}  <br>` +
                        `${period}: ${params.data.start_time} - ${params.data.end_time}`;
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
    }

    loadSleepGraph(selected: any): void {
        const sleepSelected: Sleep = this.listForGraph[selected.dataIndex];
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
                start_time: this.datePipe.transform(element.start_time, 'mediumTime'),
                end_time: this.datePipe.transform(element.end_time, 'mediumTime')
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
        this.getAllSleepsForLogs();
    }

    changeOnSleep(): void {
        const sleepsSelected = this.listCheckSleeps.filter(element => element === true);
        this.selectAll = this.listForLogs.length === sleepsSelected.length;
        this.updateStateButtonRemoveSelected();
    }

    closeModalConfirmation() {
        this.modalService.close('modalConfirmation');
    }

    openModalConfirmation(measurementId: string) {
        this.modalService.open('modalConfirmation');
        if (measurementId && measurementId !== '') {
            this.cacheListIdSleepRemove = [measurementId]
        }
    }

    initializeListChecks(): void {
        this.selectAll = false;
        this.listCheckSleeps = new Array<boolean>(this.listForLogs.length);
        for (let i = 0; i < this.listCheckSleeps.length; i++) {
            this.listCheckSleeps[i] = false;
        }
        this.updateStateButtonRemoveSelected();
    }

    async removeSleep(): Promise<any> {
        this.modalService.close('modalConfirmation');
        this.loadingSleeps = true;
        this.removingSleep = true;
        let occurredError = false;
        for (let i = 0; i < this.cacheListIdSleepRemove.length; i++) {
            try {
                const measurementRemove = this.cacheListIdSleepRemove[i];
                await this.sleepService.remove(this.patientId, measurementRemove);
            } catch (e) {
                occurredError = true;
            }
        }
        occurredError ? this.toastService
                .error(this.translateService.instant('TOAST-MESSAGES.SLEEP-NOT-REMOVED'))
            : this.toastService.info(this.translateService.instant('TOAST-MESSAGES.SLEEP-REMOVED'));

        this.getAllSleepsForLogs();
        this.loadingSleeps = false;
        this.removingSleep = false;
    }

    removeSelected() {
        const sleepsIdSelected: Array<string> = new Array<string>();
        this.listCheckSleeps.forEach((element, index) => {
            if (element) {
                sleepsIdSelected.push(this.listForLogs[index].id);
            }
        })
        this.cacheListIdSleepRemove = sleepsIdSelected;
        // this.modalConfirmRemoveMeasurement = true;
        this.openModalConfirmation('')
    }

    selectAllSleeps(): void {
        const attribSelectAll = (element: any) => {
            return !this.selectAll;
        }
        this.listCheckSleeps = this.listCheckSleeps.map(attribSelectAll);
        this.updateStateButtonRemoveSelected();
    }

    updateStateButtonRemoveSelected(): void {
        const measurementsSelected = this.listCheckSleeps.filter(element => element === true);
        this.stateButtonRemoveSelected = !!measurementsSelected.length;
    }

    trackById(index, item) {
        return item.id;
    }

}
