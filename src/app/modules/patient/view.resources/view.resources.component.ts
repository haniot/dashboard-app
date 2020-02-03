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
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'

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
    listForLogs: Array<any>;
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
    cacheListIdMeasurementRemove: Array<any>;
    selectAll: boolean;
    listCheckMeasurements: Array<boolean>;
    stateButtonRemoveSelected: boolean;
    removingResource: boolean;
    lastResource: EnumMeasurementType;

    constructor(
        private activeRouter: ActivatedRoute,
        private router: Router,
        private measurementService: MeasurementService,
        private modalService: ModalService,
        private timeSeriesService: TimeSeriesService,
        private toastService: ToastrService,
        private translateService: TranslateService) {
        this.list = new Array<any>();
        this.listForLogs = new Array<any>();
        this.listIsEmpty = false;
        this.listCheckMeasurements = new Array<boolean>();
        this.listCheckMeasurements = new Array<boolean>();
        this.cacheListIdMeasurementRemove = new Array<string>();
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

    openModalConfirmation(event: { type: EnumMeasurementType, resourceId: string | string[] }): void {
        if (event) {
            this.lastResource = event.type;
            this.cacheListIdMeasurementRemove = typeof event.resourceId === 'string' ? [event.resourceId] : event.resourceId
            this.modalService.open('modalConfirmation');
        }
    }

    closeModalConfirmation(): void {
        this.modalService.close('modalConfirmation');
    }

    loadForLogs(): void {
        this.listForLogs = new Array<any>();
        this.measurementService.getAllByUserAndType(this.patientId, this.lastResource)
            .then((httpResponse) => {
                this.listForLogs = httpResponse.body;
            })
            .catch(() => {
                this.listForLogs = []
            });

    }

    async removeResources() {
        this.removingResource = true;
        this.closeModalConfirmation();
        let occurredError = false;
        for (let i = 0; i < this.cacheListIdMeasurementRemove.length; i++) {
            try {
                const measurementRemove = this.cacheListIdMeasurementRemove[i];
                await this.measurementService.remove(this.patientId, measurementRemove);
            } catch (e) {
                occurredError = true;
            }
        }
        occurredError ? this.toastService
                .error(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-NOT-REMOVED'))
            : this.toastService.info(this.translateService.instant('TOAST-MESSAGES.MEASUREMENT-REMOVED'));
        this.loadForLogs();
        this.removingResource = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.typeOfMeasurement) {
            this.loadResource(changes.typeOfMeasurement.currentValue);
        }
    }

}
