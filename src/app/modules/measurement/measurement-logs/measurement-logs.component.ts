import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageEvent} from "@angular/material";

import {MeasurementType} from "../models/measurement";
import {MeasurementService} from "../services/measurement.service";
import {ModalService} from "../../../shared/shared-components/haniot-modal/service/modal.service";

@Component({
    selector: 'measurement-logs',
    templateUrl: './measurement-logs.component.html',
    styleUrls: ['./measurement-logs.component.scss']
})
export class MeasurementLogsComponent implements OnInit {
    // MatPaginator Inputs
    pageSizeOptions: number[] = [10, 25, 100];

    // MatPaginator Output
    pageEvent: PageEvent;

    /* Controles de paginação */
    page = 1;
    limit = 10;
    length: number;

    @Input() patientId: string;

    measurementsTypes: Array<any>;
    measurementTypeSelected: MeasurementType;

    listOfMeasurements: Array<any>;

    loadingMeasurements: boolean;

    modalConfirmRemoveMeasurement: boolean;
    cacheIdMeasurementRemove: string;
    cacheListIdMeasurementRemove: Array<string>;

    selectAll: boolean;
    listCheckMeasurements: Array<boolean>;

    stateButtonRemoveSeleted: boolean;

    constructor(
        private measurementService: MeasurementService,
        private modalService: ModalService) {
        this.measurementTypeSelected = MeasurementType.weight;
        this.measurementsTypes = Object.keys(MeasurementType);
        this.listOfMeasurements = new Array<any>();
        this.loadingMeasurements = false;
        this.modalConfirmRemoveMeasurement = false;
        this.selectAll = false;
        this.listCheckMeasurements = new Array<boolean>();
        this.cacheListIdMeasurementRemove = new Array<string>();
        this.cacheIdMeasurementRemove = '';
        this.stateButtonRemoveSeleted = false;
    }

    ngOnInit() {
        this.loadMeasurements();
    }

    loadMeasurements(): void {
        this.loadingMeasurements = true;
        this.measurementService.getAllByUserAndType(this.patientId, this.measurementTypeSelected, this.page, this.limit)
            .then(measurements => {
                this.listOfMeasurements = measurements;
                this.initializeListCheckMeasurements();
                this.calcLengthMeasurements();
                this.loadingMeasurements = false;
            })
            .catch()
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

    changeOnMeasurement(measurementIndex: number): void {
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
        this.stateButtonRemoveSeleted = !!measurementsSelected.length;
    }

    calcLengthMeasurements() {
        this.measurementService.getAllByUserAndType(this.patientId, this.measurementTypeSelected)
            .then(measurements => this.length = measurements.length)
            .catch()
    }

    trackById(index, item) {
        return item.id;
    }
}
