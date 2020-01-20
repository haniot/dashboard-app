import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { EnumMeasurementType, SearchForPeriod } from '../../measurement/models/measurement'
import { MeasurementService } from '../../measurement/services/measurement.service'
import { PageEvent } from '@angular/material'
import { ConfigurationBasic } from '../../config.matpaginator'
import { TimeSeries, TimeSeriesSimpleFilter, TimeSeriesType } from '../../activity/models/time.series'
import { TimeSeriesService } from '../../activity/services/time.series.service'

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
                    !Object.keys(EnumMeasurementType).includes(resource.toUpperCase()) &&
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
            this.filter = new TimeSeriesSimpleFilter();
            this.filter.start_date = new Date().toISOString();
            this.filter.end_date = new Date().toISOString();
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
            this.timeSeriesService.getWithResource(this.patientId, resource, this.filter)
                .then(httpResponse => {
                    this.list = httpResponse;
                    this.listIsEmpty = !httpResponse.data_set || httpResponse.data_set.length === 0;
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
