import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { EnumMeasurementType, SearchForPeriod } from '../../measurement/models/measurement'
import { MeasurementService } from '../../measurement/services/measurement.service'
import { PageEvent } from '@angular/material'
import { ConfigurationBasic } from '../../config.matpaginator'
import {
    TimeSeries,
    TimeSeriesIntervalFilter,
    TimeSeriesSimpleFilter,
    TimeSeriesType
} from '../../activity/models/time.series'
import { TimeSeriesService } from '../../activity/services/time.series.service'
import * as moment from 'moment'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'view-resources',
    templateUrl: './view.resources.component.html',
    styleUrls: ['./view.resources.component.scss']
})
export class ViewResourcesComponent implements OnInit, OnChanges {
    patientId: string;
    typeOfMeasurement: EnumMeasurementType | TimeSeriesType;
    list: Array<any> | TimeSeries | any;
    listIsEmpty: boolean;
    filter: SearchForPeriod | TimeSeriesSimpleFilter | any;
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
        private timeSeriesService: TimeSeriesService) {
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
    }

    ngOnInit() {
        this.activeRouter
            .paramMap
            .subscribe((paramsAsMap: any) => {
                const { params: { patientId, resource } } = paramsAsMap
                this.typeOfMeasurement = resource
                if (
                    !Object.keys(EnumMeasurementType).includes(resource) &&
                    !Object.keys(TimeSeriesType).includes(resource)) {
                    this.router.navigate(['/page-not-found'])
                }
                this.patientId = patientId;
                this.startFilter();
                this.loadResource(this.typeOfMeasurement);
            })
    }

    startFilter(): void {
        if (Object.keys(EnumMeasurementType).includes(this.typeOfMeasurement)) {
            this.filter = { start_at: null, end_at: new Date().toISOString().split('T')[0], period: 'today' };
        }
        if (Object.keys(TimeSeriesType).includes(this.typeOfMeasurement)) {
            this.filter = new TimeSeriesIntervalFilter();
            const dateFormatted: string = moment(new Date()).format();
            this.filter = new TimeSeriesIntervalFilter()
            this.filter.date = dateFormatted.split('T')[0];
            this.filter.interval = '1m';
        }
    }

    loadResource(resource: EnumMeasurementType | TimeSeriesType | any): any {
        if (Object.keys(EnumMeasurementType).includes(resource)) {
            this.list = new Array<any>();
            this.measurementService.getAllByUserAndType(this.patientId, resource, null, null, this.filter)
                .then((httpResponse) => {
                    this.list = httpResponse.body;
                    this.listIsEmpty = this.list.length === 0;
                })
                .catch(() => {
                    this.listIsEmpty = true;
                });
        }
        if (Object.keys(TimeSeriesType).includes(resource)) {
            this.list = undefined;
            this.timeSeriesService.getWithResourceAndInterval(this.patientId, resource, this.filter)
                .then(httpResponse => {
                    if (httpResponse && httpResponse.data_set) {
                        this.list = httpResponse;
                    }
                    this.listIsEmpty = !(this.list);
                    this.listIsEmpty = !(this.list) || (!this.list.summary || !this.list.summary.total);
                    if (resource === TimeSeriesType.heart_rate) {
                        this.listIsEmpty = !(this.list) || (!this.list.summary || (!this.list.summary._fat_burn_total &&
                            !this.list.summary._cardio_total &&
                            !this.list.summary._peak_total &&
                            !this.list.summary._out_of_range_total));
                    }
                })
                .catch(() => {
                    this.listIsEmpty = true;
                })
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.typeOfMeasurement) {
            this.loadResource(changes.typeOfMeasurement.currentValue);
        }
    }

}
