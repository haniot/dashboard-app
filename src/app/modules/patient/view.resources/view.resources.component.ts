import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { EnumMeasurementType, SearchForPeriod } from '../../measurement/models/measurement'
import { MeasurementService } from '../../measurement/services/measurement.service'
import { PageEvent } from '@angular/material'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { ConfigurationBasic } from '../../config.matpaginator'
import { Sleep, SleepPattern, SleepPatternSummaryData } from '../../activity/models/sleep'
import { TimeSeries, TimeSeriesType } from '../../activity/models/time.series'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'view-resources',
    templateUrl: './view.resources.component.html',
    styleUrls: ['./view.resources.component.scss']
})
export class ViewResourcesComponent implements OnInit, OnChanges {
    patientId: string;
    typeOfMeasurement: EnumMeasurementType | TimeSeriesType | string;
    list: Array<any>;
    listIsEmpty: boolean;
    filter: SearchForPeriod;
    allTypesOfMeasurement = EnumMeasurementType;
    allTypesOfTimeSerie = TimeSeriesType;
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
        private activeRouter: ActivatedRoute,
        private router: Router,
        private measurementService: MeasurementService,
        private toastService: ToastrService,
        private translateService: TranslateService) {
        this.list = new Array<any>();
        this.listIsEmpty = false;
        this.listCheckMeasurements = new Array<boolean>();
        this.listCheckMeasurements = new Array<boolean>();
        this.cacheListIdMeasurementRemove = new Array<string>();
        this.cacheIdMeasurementRemove = '';
        this.stateButtonRemoveSelected = false;
        this.listIsEmpty = false;

        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;

        this.loadingMeasurements = false;
        this.modalConfirmRemoveMeasurement = false;
        this.selectAll = false;
        this.listCheckMeasurements = new Array<boolean>();
        this.cacheListIdMeasurementRemove = new Array<string>();
        this.cacheIdMeasurementRemove = '';
        this.stateButtonRemoveSelected = false;

        // this.filter = { start_at: null, end_at: new Date().toISOString().split('T')[0], period: 'today' };
    }

    ngOnInit() {
        this.activeRouter
            .paramMap
            .subscribe((paramsAsMap: any) => {
                const { params: { patientId, resource } } = paramsAsMap
                this.typeOfMeasurement = resource
                if (
                    !Object.keys(EnumMeasurementType).includes(resource.toUpperCase()) &&
                    !Object.keys(TimeSeriesType).includes(resource) && resource !== 'sleep') {
                    this.router.navigate(['/page-not-found'])
                }
                this.patientId = patientId;
                this.loadResource(this.typeOfMeasurement);
            })
    }

    loadResource(resource: EnumMeasurementType | string): any {
        this.list = new Array<any>();
        /* Mocks*/
        if (resource === 'sleep') {
            const sleep = new Sleep()
            sleep.start_time = '2018-08-18T01:40:30.00Z';
            sleep.end_time = '2018-08-18T09:36:30.00Z';
            sleep.duration = 29520000;
            sleep.pattern = new SleepPattern()
            sleep.pattern.data_set = [
                {
                    start_time: '2018-08-18T01:40:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:41:30.00Z',
                    name: 'asleep',
                    duration: 360000
                },
                {
                    start_time: '2018-08-18T01:47:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T01:51:30.00Z',
                    name: 'asleep',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:52:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:53:30.00Z',
                    name: 'asleep',
                    duration: 2100000
                },
                {
                    start_time: '2018-08-18T02:28:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T02:32:30.00Z',
                    name: 'awake',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T02:35:30.00Z',
                    name: 'asleep',
                    duration: 15120000
                },
                {
                    start_time: '2018-08-18T06:47:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T06:48:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T07:31:30.00Z',
                    name: 'restless',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:33:30.00Z',
                    name: 'asleep',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:35:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:36:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T07:56:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:57:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T08:40:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T08:43:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T09:04:30.00Z',
                    name: 'asleep',
                    duration: 1740000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T09:36:30.00Z',
                    name: 'asleep',
                    duration: 960000
                }
            ];

            sleep.pattern.summary.asleep = new SleepPatternSummaryData()
            sleep.pattern.summary.asleep.count = 55;
            sleep.pattern.summary.asleep.duration = 28020000;

            sleep.pattern.summary.awake = new SleepPatternSummaryData()
            sleep.pattern.summary.awake.count = 5;
            sleep.pattern.summary.awake.duration = 28020000;

            sleep.pattern.summary.restless = new SleepPatternSummaryData()
            sleep.pattern.summary.restless.count = 40;
            sleep.pattern.summary.restless.duration = 28020000;

            const sleep3 = new Sleep()
            sleep3.start_time = '2018-08-18T01:40:30.00Z';
            sleep3.end_time = '2018-08-18T09:36:30.00Z';
            sleep3.duration = 34420000;
            sleep3.pattern = new SleepPattern()
            sleep3.pattern.data_set = [
                {
                    start_time: '2018-08-18T01:40:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:41:30.00Z',
                    name: 'asleep',
                    duration: 360000
                },
                {
                    start_time: '2018-08-18T01:47:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T01:51:30.00Z',
                    name: 'asleep',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:52:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:53:30.00Z',
                    name: 'asleep',
                    duration: 2100000
                },
                {
                    start_time: '2018-08-18T02:28:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T02:32:30.00Z',
                    name: 'awake',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T02:35:30.00Z',
                    name: 'asleep',
                    duration: 15120000
                },
                {
                    start_time: '2018-08-18T06:47:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T06:48:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T07:31:30.00Z',
                    name: 'restless',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:33:30.00Z',
                    name: 'asleep',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:35:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:36:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T07:56:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:57:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T08:40:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T08:43:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T09:04:30.00Z',
                    name: 'asleep',
                    duration: 1740000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T09:36:30.00Z',
                    name: 'asleep',
                    duration: 960000
                }
            ];

            sleep3.pattern.summary.asleep = new SleepPatternSummaryData()
            sleep3.pattern.summary.asleep.count = 63;
            sleep3.pattern.summary.asleep.duration = 28020000;

            sleep3.pattern.summary.awake = new SleepPatternSummaryData()
            sleep3.pattern.summary.awake.count = 7;
            sleep3.pattern.summary.awake.duration = 28020000;

            sleep3.pattern.summary.restless = new SleepPatternSummaryData()
            sleep3.pattern.summary.restless.count = 30;
            sleep3.pattern.summary.restless.duration = 28020000;

            const sleep2 = new Sleep()
            sleep2.start_time = '2018-08-18T01:40:30.00Z';
            sleep2.end_time = '2018-08-18T09:36:30.00Z';
            sleep2.duration = 39720000;
            sleep2.pattern = new SleepPattern()
            sleep2.pattern.data_set = [
                {
                    start_time: '2018-08-18T01:40:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:41:30.00Z',
                    name: 'asleep',
                    duration: 360000
                },
                {
                    start_time: '2018-08-18T01:47:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T01:51:30.00Z',
                    name: 'asleep',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:52:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:53:30.00Z',
                    name: 'asleep',
                    duration: 2100000
                },
                {
                    start_time: '2018-08-18T02:28:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T02:32:30.00Z',
                    name: 'awake',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T02:35:30.00Z',
                    name: 'asleep',
                    duration: 15120000
                },
                {
                    start_time: '2018-08-18T06:47:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T06:48:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T07:31:30.00Z',
                    name: 'restless',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:33:30.00Z',
                    name: 'asleep',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:35:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:36:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T07:56:30.00Z',
                    name: 'restless',
                    duration: 60000
                }
            ];

            sleep2.pattern.summary.asleep = new SleepPatternSummaryData()
            sleep2.pattern.summary.asleep.count = 45;
            sleep2.pattern.summary.asleep.duration = 28020000;

            sleep2.pattern.summary.awake = new SleepPatternSummaryData()
            sleep2.pattern.summary.awake.count = 5;
            sleep2.pattern.summary.awake.duration = 28020000;

            sleep2.pattern.summary.restless = new SleepPatternSummaryData()
            sleep2.pattern.summary.restless.count = 50;
            sleep2.pattern.summary.restless.duration = 28020000;

            return this.list = [sleep, sleep2, sleep3];
        }

        if (Object.keys(TimeSeriesType).includes(resource)) {

            if (resource === TimeSeriesType.heart_rate) {
                /* Mocks*/
                const heartRateMock = new TimeSeries();
                heartRateMock.data_set = [
                    { value: 50, date: '2016-10-03T05:59:20' }, {
                        value: 143,
                        date: '2014-09-26T09:35:11'
                    }, { value: 5, date: '2016-04-29T01:39:18' }, { value: 85, date: '2014-10-12T02:14:09' }, {
                        value: 125,
                        date: '2015-03-07T10:33:04'
                    }, { value: 71, date: '2015-02-03T02:02:05' }, { value: 134, date: '2014-08-15T07:37:07' }, {
                        value: 126,
                        date: '2016-03-31T07:06:59'
                    }, { value: 54, date: '2014-08-20T10:04:14' }, { value: 144, date: '2014-03-08T08:13:13' }, {
                        value: 97,
                        date: '2019-06-06T03:51:03'
                    }, { value: 102, date: '2015-12-15T07:44:19' }, { value: 133, date: '2015-01-09T12:28:56' }, {
                        value: 30,
                        date: '2018-03-31T11:40:35'
                    }, { value: 42, date: '2016-12-16T05:35:41' }, { value: 119, date: '2014-10-22T09:18:48' }, {
                        value: 128,
                        date: '2016-12-01T07:11:20'
                    }, { value: 115, date: '2015-11-09T12:33:34' }, { value: 26, date: '2017-07-12T09:49:07' }, {
                        value: 124,
                        date: '2019-07-27T08:57:29'
                    }, { value: 92, date: '2016-10-03T05:59:13' }, { value: 30, date: '2019-11-16T03:52:47' }, {
                        value: 83,
                        date: '2014-11-03T12:49:58'
                    }, { value: 52, date: '2015-10-01T07:57:48' }, { value: 59, date: '2015-05-11T01:22:55' }, {
                        value: 48,
                        date: '2017-03-06T09:20:24'
                    }, { value: 143, date: '2018-12-13T03:45:07' }, { value: 6, date: '2018-04-19T04:26:40' }, {
                        value: 31,
                        date: '2017-11-20T02:08:31'
                    }, { value: 127, date: '2018-05-27T07:01:44' }, { value: 20, date: '2014-12-22T11:06:15' }, {
                        value: 76,
                        date: '2017-06-18T02:21:36'
                    }, { value: 104, date: '2018-03-13T10:04:29' }, { value: 141, date: '2017-10-11T11:48:58' }, {
                        value: 19,
                        date: '2019-10-16T10:39:26'
                    }, { value: 133, date: '2016-11-12T05:04:00' }, { value: 147, date: '2014-07-10T02:34:48' }, {
                        value: 19,
                        date: '2018-01-02T10:47:17'
                    }, { value: 35, date: '2018-07-29T10:16:46' }, { value: 50, date: '2019-09-29T07:24:52' }, {
                        value: 92,
                        date: '2017-12-23T12:44:47'
                    }, { value: 75, date: '2017-10-18T03:08:08' }, { value: 123, date: '2016-01-19T11:33:53' }, {
                        value: 66,
                        date: '2014-10-28T12:54:37'
                    }, { value: 53, date: '2017-04-10T08:31:50' }, { value: 66, date: '2016-03-20T09:10:58' }, {
                        value: 135,
                        date: '2019-07-24T12:51:58'
                    }, { value: 45, date: '2015-05-01T08:30:10' }, { value: 77, date: '2018-01-17T06:50:44' }, {
                        value: 130,
                        date: '2017-10-27T12:43:22'
                    }, { value: 118, date: '2014-12-10T11:23:00' }, { value: 62, date: '2017-06-02T05:20:43' }, {
                        value: 141,
                        date: '2016-11-20T08:02:11'
                    }, { value: 107, date: '2015-01-31T02:36:54' }, { value: 52, date: '2016-12-07T07:54:08' }, {
                        value: 51,
                        date: '2016-11-30T11:49:40'
                    }]
                this.list = [heartRateMock];
            } else {
                const step = new TimeSeries()
                step.data_set = [
                    {
                        value: 60000,
                        date: '2018-08-18T01:40:30.00Z'

                    },
                    {
                        date: '2018-08-18T01:41:30.00Z',
                        value: 360000
                    },
                    {
                        date: '2018-08-18T01:47:30.00Z',
                        value: 240000
                    },
                    {
                        date: '2018-08-18T01:51:30.00Z',
                        value: 60000
                    },
                    {
                        date: '2018-08-18T01:52:30.00Z',
                        value: 60000
                    },
                    {
                        date: '2018-08-18T01:53:30.00Z',
                        value: 2100000
                    },
                    {
                        date: '2018-08-18T02:28:30.00Z',
                        value: 240000
                    },
                    {
                        date: '2018-08-18T02:32:30.00Z',
                        value: 180000
                    },
                    {
                        date: '2018-08-18T02:35:30.00Z',
                        value: 15120000
                    },
                    {
                        date: '2018-08-18T06:47:30.00Z',
                        value: 60000
                    },
                    {
                        date: '2018-08-18T06:48:30.00Z',
                        value: 2580000
                    },
                    {
                        date: '2018-08-18T07:31:30.00Z',
                        value: 120000
                    },
                    {
                        date: '2018-08-18T07:33:30.00Z',
                        value: 120000
                    },
                    {
                        date: '2018-08-18T07:35:30.00Z',
                        value: 60000
                    },
                    {
                        date: '2018-08-18T07:36:30.00Z',
                        value: 1200000
                    },
                    {
                        date: '2018-08-18T07:56:30.00Z',
                        value: 60000
                    },
                    {
                        date: '2018-08-18T07:57:30.00Z',
                        value: 2580000
                    },
                    {
                        date: '2018-08-18T08:40:30.00Z',
                        value: 180000
                    },
                    {
                        date: '2018-08-18T08:43:30.00Z',
                        value: 1200000
                    },
                    {
                        date: '2018-08-18T09:03:30.00Z',
                        value: 60000
                    },
                    {
                        date: '2018-08-18T09:04:30.00Z',
                        value: 1740000
                    },
                    {
                        date: '2018-08-18T09:03:30.00Z',
                        value: 180000
                    },
                    {
                        date: '2018-08-18T09:36:30.00Z',
                        value: 960000
                    }

                ];
                this.list = [step];
            }
        }

        // this.measurementService.getAllByUserAndType(this.patientId, resource, null, null, this.filter)
        //     .then((httpResponse) => {
        //         this.list = httpResponse.body;
        //         this.listIsEmpty = this.list.length === 0;
        //     })
        //     .catch(() => {
        //         this.listIsEmpty = true;
        //     });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.typeOfMeasurement) {
            this.loadResource(changes.typeOfMeasurement.currentValue);
        }
    }

    // initializeListCheckMeasurements(): void {
    //     this.selectAll = false;
    //     this.listCheckMeasurements = new Array<boolean>(this.list.length);
    //     for (let i = 0; i < this.listCheckMeasurements.length; i++) {
    //         this.listCheckMeasurements[i] = false;
    //     }
    //     this.updateStateButtonRemoveSelected();
    // }
    //
    // selectAllMeasurements(): void {
    //     const attribSelectAll = (element: any) => {
    //         return !this.selectAll;
    //     }
    //     this.listCheckMeasurements = this.listCheckMeasurements.map(attribSelectAll);
    //     this.updateStateButtonRemoveSelected();
    // }
    //
    // clickPagination(event) {
    //     this.pageEvent = event;
    //     this.page = event.pageIndex + 1;
    //     this.limit = event.pageSize;
    //     this.loadResource(this.typeOfMeasurement);
    // }
    //
    // openModalConfirmation(measurementId: string) {
    //     this.cacheIdMeasurementRemove = measurementId;
    //     this.modalConfirmRemoveMeasurement = true;
    // }
    //
    // closeModalComfimation() {
    //     this.cacheIdMeasurementRemove = '';
    //     this.modalConfirmRemoveMeasurement = false;
    // }
    //
    // async removeMeasurement(): Promise<any> {
    //     this.loadingMeasurements = true;
    //     if (!this.cacheListIdMeasurementRemove || !this.cacheListIdMeasurementRemove.length) {
    //         this.measurementService.remove(this.patientId, this.cacheIdMeasurementRemove)
    //             .then(measurements => {
    //                 this.loadResource(this.typeOfMeasurement);
    //                 this.loadingMeasurements = false;
    //                 this.modalConfirmRemoveMeasurement = false;
    //                 this.toastService.info(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-REMOVED'));
    //             })
    //             .catch(() => {
    //                 this.toastService.error(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-NOT-REMOVED'));
    //                 this.loadingMeasurements = false;
    //                 this.modalConfirmRemoveMeasurement = false;
    //             })
    //     } else {
    //         let occuredError = false;
    //         for (let i = 0; i < this.cacheListIdMeasurementRemove.length; i++) {
    //             try {
    //                 const measurementRemove = this.cacheListIdMeasurementRemove[i];
    //                 await this.measurementService.remove(this.patientId, measurementRemove.id);
    //             } catch (e) {
    //                 occuredError = true;
    //             }
    //         }
    //         occuredError ? this.toastService
    //                 .error(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-NOT-REMOVED'))
    //             : this.toastService.info(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-REMOVED'));
    //
    //         this.loadResource(this.typeOfMeasurement);
    //         this.loadingMeasurements = false;
    //         this.modalConfirmRemoveMeasurement = false;
    //     }
    // }
    //
    // changeOnMeasurement(): void {
    //     const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
    //     this.selectAll = this.list.length === measurementsSelected.length;
    //     this.updateStateButtonRemoveSelected();
    // }
    //
    // removeSelected() {
    //     const measurementsIdSelected: Array<string> = new Array<string>();
    //     this.listCheckMeasurements.forEach((element, index) => {
    //         if (element) {
    //             measurementsIdSelected.push(this.list[index]);
    //         }
    //     })
    //     this.cacheListIdMeasurementRemove = measurementsIdSelected;
    //     this.modalConfirmRemoveMeasurement = true;
    // }
    //
    // updateStateButtonRemoveSelected(): void {
    //     const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
    //     this.stateButtonRemoveSelected = !!measurementsSelected.length;
    // }
    //
    // changeFilter(event): void {
    //     this.list = event;
    //     this.listIsEmpty = this.list.length === 0;
    // }
    //
    // trackById(index, item) {
    //     return item.id;
    // }

}
