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
    @Input() data: Array<BloodGlucose>;
    @Input() filterVisibility: boolean;
    @Input() patientId: string;
    @Input() includeCard: boolean;
    @Input() includeLogs: boolean;
    @Input() showSpinner: boolean;
    @Output() filterChange: EventEmitter<any>;
    lastData: BloodGlucose;
    options: any;
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
        private measurementService: MeasurementService,
        private translateService: TranslateService,
        private toastService: ToastrService
    ) {
        this.data = new Array<BloodGlucose>();
        this.lastData = new BloodGlucose();
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
        this.getLastData();
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
        const hypoglycemia = this.translateService.instant('MEASUREMENTS.BLOOD-GLUCOSE.HYPOGLYCEMIA');
        const normal = this.translateService.instant('MEASUREMENTS.BLOOD-GLUCOSE.NORMAL');
        const target = this.translateService.instant('MEASUREMENTS.BLOOD-GLUCOSE.TARGET');
        const upperLimit = this.translateService.instant('SHARED.UPPER-LIMIT');
        const classification = this.translateService.instant('SHARED.CLASSIFICATION');

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
                markLine: {
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
                        {
                            label: {
                                formatter: hypoglycemia
                            },
                            yAxis: 70
                        }, {
                            label: {
                                formatter: normal
                            },
                            yAxis: 140
                        }, {
                            label: {
                                formatter: target
                            },
                            yAxis: 250
                        }]
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


        this.data.forEach((element: BloodGlucose, index) => {
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
                { x: '5%', y: '7%', width: '100%' }
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
                this.data = httpResponse.body;
                this.showSpinner = false;
                this.updateGraph(this.data);
                this.filterChange.emit(this.data);
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

    ngOnChanges(changes: SimpleChanges) {
        if ((changes.data.currentValue && changes.data.previousValue
            && changes.data.currentValue.length !== changes.data.previousValue.length) ||
            (changes.data.currentValue.length && !changes.data.previousValue)) {
            this.loadGraph();
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
        this.selectAll = this.data.length === measurementsSelected.length;
        this.updateStateButtonRemoveSelected();
    }

    closeModalConfimation() {
        this.cacheIdMeasurementRemove = '';
        this.modalConfirmRemoveMeasurement = false;
    }

    loadMeasurements(): any {
        this.measurementService
            .getAllByUserAndType(this.patientId, EnumMeasurementType.blood_glucose, this.page, this.limit, this.filter)
            .then((httpResponse) => {
                this.data = httpResponse.body;
                this.listIsEmpty = this.data.length === 0;
                this.initializeListCheckMeasurements();
            })
            .catch(() => {
                this.listIsEmpty = true;
            });
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

    getLastData(): void {
        this.measurementService
            .getAllByUserAndType(this.patientId, EnumMeasurementType.blood_glucose, 1, 1)
            .then((httpResponse) => {
                this.lastData = httpResponse.body[0];
            })
            .catch(() => {
                this.lastData = new BloodGlucose();
            });
    }

    updateStateButtonRemoveSelected(): void {
        const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
        this.stateButtonRemoveSelected = !!measurementsSelected.length;
    }

    trackById(index, item) {
        return item.id;
    }

}
