import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { BloodGlucose, MealType } from '../models/blood.glucose';
import { MeasurementService } from '../services/measurement.service';
import { EnumMeasurementType, SearchForPeriod } from '../models/measurement'
import { PageEvent } from '@angular/material'
import { ConfigurationBasic } from '../../config.matpaginator'
import { ToastrService } from 'ngx-toastr'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'blood-glucose',
    templateUrl: './blood.glucose.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class BloodGlucoseComponent implements OnInit, OnChanges {
    @Input() dataForGraph: Array<BloodGlucose>;
    @Input() dataForLogs: Array<BloodGlucose>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() includeLogs: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    @Output() remove: EventEmitter<{ type: EnumMeasurementType, resourceId: string | string[] }>;
    lastData: BloodGlucose;
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
    removingMeasurements: boolean;
    selectAll: boolean;
    listCheckMeasurements: Array<boolean>;
    stateButtonRemoveSelected: boolean;

    constructor(
        private datePipe: DatePipe,
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private toastService: ToastrService
    ) {
        this.dataForGraph = new Array<BloodGlucose>();
        this.dataForLogs = new Array<BloodGlucose>();
        this.lastData = new BloodGlucose();
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
        this.removingMeasurements = false;
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

        const preprandial = this.translateService.instant('MEASUREMENTS.PIPES.MEAL.PREPRANDIAL');
        const postprandial = this.translateService.instant('MEASUREMENTS.PIPES.MEAL.POSTPRANDIAL');
        const fasting = this.translateService.instant('MEASUREMENTS.PIPES.MEAL.FASTING');
        const casual = this.translateService.instant('MEASUREMENTS.PIPES.MEAL.CASUAL');
        const bedtime = this.translateService.instant('MEASUREMENTS.PIPES.MEAL.BEDTIME');
        const max = this.translateService.instant('MEASUREMENTS.MAX');
        const min = this.translateService.instant('MEASUREMENTS.MIN');
        const glucose = this.translateService.instant('MEASUREMENTS.BLOOD-GLUCOSE.GLUCOSE');
        const date = this.translateService.instant('SHARED.DATE-AND-HOUR');
        const at = this.translateService.instant('SHARED.AT');
        const upperLimit = this.translateService.instant('SHARED.UPPER-LIMIT');
        const classification = this.translateService.instant('SHARED.CLASSIFICATION');

        if (!this.includeCard) {
            const length = this.dataForGraph ? this.dataForGraph.length : 0;
            this.lastData = length ? this.dataForGraph[length - 1] : new BloodGlucose();
        }

        const xAxis = {
            type: 'category',
            data: [],
            axisLabel: {
                formatter: function (params: string) {
                    return params.split(/,|\s/)[0];
                }
            }
        };

        const markPoint = {
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
            data: [
                { type: 'max' },
                { type: 'min' }
            ]
        }

        const labelOption = {
            normal: {
                show: true,
                position: 'inside',
                align: 'left',
                verticalAlign: 'middle',
                rotate: 270,
                formatter: function (params) {
                    const { data: { time } } = params
                    return time
                },
                fontSize: 14,
                rich: {
                    name: {
                        textBorderColor: '#fff'
                    }
                }
            }
        };

        const series = [
            {
                name: preprandial,
                label: labelOption,
                type: 'bar',
                data: [],
                barMaxWidth: 100,
                color: '#e57373',
                markPoint: markPoint,
                markArea: {
                    silent: false,
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            try {
                                const { data: { label: { formatter } }, value } = params
                                return `${upperLimit}: ${value}mg/dl<br>${classification}: ${formatter}`;
                            } catch (e) {
                            }
                        }
                    },
                    data: [
                        // {
                        //     label: {
                        //         formatter: hypoglycemia,
                        //         position: 'start'
                        //     },
                        //     yAxis: 70
                        // }, {
                        //     label: {
                        //         formatter: normal,
                        //         position: 'start'
                        //     },
                        //     yAxis: 140
                        // }, {
                        //     label: {
                        //         formatter: target,
                        //         position: 'start'
                        //     },
                        //     yAxis: 180
                        // }
                        [
                            {
                                yAxis: 0,
                                itemStyle: {
                                    color: 'rgba(0,128,255,0.1)'
                                }
                            },
                            {
                                yAxis: 70
                            }
                        ],
                        [
                            {
                                yAxis: 70,
                                itemStyle: { color: 'rgba(25,142,125,0.1)' }
                            },
                            {
                                yAxis: 140
                            }
                        ],
                        [
                            {
                                yAxis: 140,
                                itemStyle: { color: 'rgba(252,204,0,0.1)' }
                            },
                            {}
                        ]
                    ]
                }
            },
            {
                name: postprandial,
                label: labelOption,
                type: 'bar',
                data: [],
                barMaxWidth: 100,
                color: '#2f4553',
                markPoint: markPoint
            },
            {
                name: fasting,
                label: labelOption,
                type: 'bar',
                data: [],
                barMaxWidth: 100,
                color: '#629fa6',
                markPoint: markPoint
                // markArea: {
                //     silent: true,
                //     itemStyle: {
                //         normal: {
                //             color: 'transparent',
                //             borderWidth: 1,
                //             borderType: 'dashed'
                //         }
                //     },
                //     data: [[{
                //         name: 'Area',
                //         xAxis: 'min',
                //         yAxis: 'min'
                //     }, {
                //         xAxis: 'max',
                //         yAxis: 'max'
                //     }]]
                // }
            },
            {
                name: casual,
                label: labelOption,
                type: 'bar',
                data: [],
                barMaxWidth: 100,
                color: '#d28168',
                markPoint: markPoint

            },
            {
                name: bedtime,
                label: labelOption,
                type: 'bar',
                data: [],
                barMaxWidth: 100,
                color: '#D2B48C',
                markPoint: markPoint
            }
        ];

        // const preprandials = this.data.filter((measurement: BloodGlucose) => {
        //     return measurement.meal === MealType.preprandial;
        // });
        // const postprandials = this.data.filter((measurement: BloodGlucose) => {
        //     return measurement.meal === MealType.postprandial;
        // });
        // const fastings = this.data.filter((measurement: BloodGlucose) => {
        //     return measurement.meal === MealType.fasting;
        // });
        // const casuals = this.data.filter((measurement: BloodGlucose) => {
        //     return measurement.meal === MealType.casual;
        // });
        // const bedtimes = this.data.filter((measurement: BloodGlucose) => {
        //     return measurement.meal === MealType.bedtime;
        // });


        this.dataForGraph.forEach((element: BloodGlucose, index) => {
            const mediumTime = this.datePipe.transform(element.timestamp, 'mediumTime');
            const newDate = this.datePipe.transform(element.timestamp, 'short');
            const findDate = xAxis.data.find(currentDate => {
                return currentDate === newDate
            })

            if (findDate) {
                index = xAxis.data.indexOf(findDate);
            } else {
                index = xAxis.data.push(newDate) - 1;
            }

            switch (element.meal) {
                case MealType.preprandial:
                    series[0].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.postprandial:
                    series[1].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.fasting:
                    series[2].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.casual:
                    series[3].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.bedtime:
                    series[4].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
            }
        });

        this.options = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if (!params.data || !params.data.time) {
                        const t = series[params.seriesIndex].data.find(currentHeight => {
                            if (currentHeight) {
                                return currentHeight.value === params.data.value;
                            }
                        });
                        params.data.time = t.time;

                    }
                    return `${glucose}: ${params.data.value}mg/dl<br>` +
                        `${date}: <br>${params.name.split(/,|\s/)[0]} ${at} ${params.data.time}`
                }
            },
            legend: {
                data: [preprandial, postprandial, fasting, casual, bedtime]
            },
            grid: [
                { x: '8%', y: '9%', width: '100%' }
            ],
            xAxis: xAxis,
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}mg/dl'
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

    applyFilter(filter: SearchForPeriod) {
        this.showSpinner = true;
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.blood_glucose, null, null, filter)
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
        const preprandials = measurements.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.preprandial;
        });
        const postprandials = measurements.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.postprandial;
        });
        const fastings = measurements.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.fasting;
        });
        const casuals = measurements.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.casual;
        });
        const bedtimes = measurements.filter((measurement: BloodGlucose) => {
            return measurement.meal === MealType.bedtime;
        });

        // clean
        this.options.xAxis.data = [];
        this.options.series[0].data = new Array(preprandials.length);
        this.options.series[1].data = new Array(preprandials.length + postprandials.length);
        this.options.series[2].data = new Array(postprandials.length + fastings.length);
        this.options.series[3].data = new Array(fastings.length + casuals.length);
        this.options.series[4].data = new Array(casuals.length + bedtimes.length);

        measurements.forEach((element: BloodGlucose, index) => {
            const mediumTime = this.datePipe.transform(element.timestamp, 'mediumTime');
            const newDate = this.datePipe.transform(element.timestamp, 'shortDate');
            const findDate = this.options.xAxis.data.find(currentDate => {
                return currentDate === newDate
            })

            if (findDate) {
                index = this.options.xAxis.data.indexOf(findDate);
            } else {
                index = this.options.xAxis.data.push(newDate) - 1;
            }

            switch (element.meal) {
                case MealType.preprandial:
                    this.options.series[0].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.postprandial:
                    this.options.series[1].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.fasting:
                    this.options.series[2].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.casual:
                    this.options.series[3].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
                case MealType.bedtime:
                    this.options.series[4].data[index] = {
                        value: element.value,
                        time: mediumTime
                    };
                    break;
            }
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
            .getAllByUserAndType(this.patientId, EnumMeasurementType.blood_glucose, this.page, this.limit)
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
                this.lastData = new BloodGlucose();
            });
    }

    openModalConfirmation(measurementId: string) {
        this.remove.emit({ type: EnumMeasurementType.blood_glucose, resourceId: measurementId })
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
        this.remove.emit({ type: EnumMeasurementType.blood_glucose, resourceId: measurementsIdSelected })
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
        this.logsIsEmpty = this.dataForLogs.length === 0;
        this.initializeListCheckMeasurements();
    }

}
