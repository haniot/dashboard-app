import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';

import { MeasurementService } from '../services/measurement.service';
import { ConfigurationBasic } from '../../config.matpaginator'
import { EnumMeasurementType } from '../models/measurement'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'measurement-logs',
    templateUrl: './measurement.logs.component.html',
    styleUrls: ['./measurement.logs.component.scss']
})
export class MeasurementLogsComponent implements OnInit {
    @Input() patientId: string;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    measurementsTypes: Array<any>;
    measurementTypeSelected: EnumMeasurementType;
    listOfMeasurements: Array<any>;
    listOfMeasurementsIsEmpty: boolean;
    loadingMeasurements: boolean;
    modalConfirmRemoveMeasurement: boolean;
    cacheIdMeasurementRemove: string;
    cacheListIdMeasurementRemove: Array<string>;
    selectAll: boolean;
    listCheckMeasurements: Array<boolean>;
    stateButtonRemoveSelected: boolean;

    constructor(
        private measurementService: MeasurementService) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.measurementTypeSelected = EnumMeasurementType.weight;
        this.measurementsTypes = Object.keys(EnumMeasurementType);
        this.listOfMeasurements = new Array<any>();
        this.loadingMeasurements = false;
        this.modalConfirmRemoveMeasurement = false;
        this.selectAll = false;
        this.listCheckMeasurements = new Array<boolean>();
        this.cacheListIdMeasurementRemove = new Array<string>();
        this.cacheIdMeasurementRemove = '';
        this.stateButtonRemoveSelected = false;
        this.listOfMeasurementsIsEmpty = false;
    }

    ngOnInit() {
        this.loadMeasurements();
    }

    loadMeasurements(): void {
        this.loadingMeasurements = true;
        this.measurementService.getAllByUserAndType(this.patientId, this.measurementTypeSelected, this.page, this.limit)
            .then(httpResponse => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.listOfMeasurements = httpResponse.body;
                }
                this.loadingMeasurements = false;
                this.listOfMeasurementsIsEmpty = !(this.listOfMeasurements && this.listOfMeasurements.length);
                this.initializeListCheckMeasurements();
            })
            .catch(() => {
                this.listOfMeasurementsIsEmpty = true;
            })
    }

    changeMeasurementType(): void {
        this.loadMeasurements();
    }

    initializeListCheckMeasurements(): void {
        this.selectAll = false;
        this.listCheckMeasurements = new Array<boolean>(this.listOfMeasurements.length);
        for (let i = 0; i < this.listCheckMeasurements.length; i++) {
            this.listCheckMeasurements[i] = false;
        }
        this.updateStateButtonRemoveSelected();
    }

    selectAllMeasurements(): void {
        const attribSelectAll = (element: any) => {
            return !this.selectAll;
        }
        this.listCheckMeasurements = this.listCheckMeasurements.map(attribSelectAll);
        this.updateStateButtonRemoveSelected();
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.loadMeasurements();
    }

    openModalConfirmation(measurementId: string) {
        this.cacheIdMeasurementRemove = measurementId;
        this.modalConfirmRemoveMeasurement = true;
    }

    closeModalComfimation() {
        this.cacheIdMeasurementRemove = '';
        this.modalConfirmRemoveMeasurement = false;
    }

    removeMeasurement(): void {
        this.loadingMeasurements = true;
        this.measurementService.remove(this.patientId, this.cacheIdMeasurementRemove)
            .then(measurements => {
                this.loadMeasurements();
                this.loadingMeasurements = false;
                this.modalConfirmRemoveMeasurement = false;
            })
            .catch()
    }

    changeOnMeasurement(): void {
        const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
        this.selectAll = this.listOfMeasurements.length === measurementsSelected.length;
        this.updateStateButtonRemoveSelected();
    }

    removeSelected() {
        const measurementsIdSelected: Array<string> = new Array<string>();
        this.listCheckMeasurements.forEach((element, index) => {
            if (element) {
                measurementsIdSelected.push(this.listOfMeasurements[index]);
            }
        })
        this.cacheListIdMeasurementRemove = measurementsIdSelected;
        this.modalConfirmRemoveMeasurement = true;

    }

    updateStateButtonRemoveSelected(): void {
        const measurementsSelected = this.listCheckMeasurements.filter(element => element === true);
        this.stateButtonRemoveSelected = !!measurementsSelected.length;
    }

    trackById(index, item) {
        return item.id;
    }
}
