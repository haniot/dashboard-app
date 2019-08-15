import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { PilotStudyService } from '../services/pilot.study.service';
import { PilotStudy } from '../models/pilot.study';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'pilot-study-table',
    templateUrl: './pilot.study.table.component.html',
    styleUrls: ['./pilot.study.table.component.scss']
})
export class PilotStudyTableComponent implements OnInit {
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    list: Array<PilotStudy>;
    search: string;
    searchTime;
    cacheStudyIdRemove: string;
    listOfPilotsIsEmpty: boolean;
    pilotStudy_id: string;

    constructor(
        private pilotStudyService: PilotStudyService,
        private paginatorService: PaginatorIntlService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private translateService: TranslateService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.listOfPilotsIsEmpty = false;
        this.list = new Array<PilotStudy>();
    }

    ngOnInit() {
        this.getAllPilotStudies();
    }

    getAllPilotStudies() {
        this.pilotStudyService.getAll(this.page, this.limit)
            .then(httpResponse => {
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    this.list = httpResponse.body;
                }
                this.listOfPilotsIsEmpty = this.list.length === 0;
            })
            .catch();
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.pilotStudyService.getAll(this.page, this.limit, this.search)
                .then(httpResponse => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                    if (httpResponse.body && httpResponse.body.length) {
                        this.list = httpResponse.body;
                    }
                })
                .catch();
        }, 200);
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllPilotStudies();
    }

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        return this.paginatorService.getIndex(this.pageEvent, this.limit, index);
    }

    removeStudy() {
        if (this.cacheStudyIdRemove) {
            this.pilotStudyService.remove(this.cacheStudyIdRemove)
                .then(() => {
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.STUDY-REMOVED'));
                    this.getAllPilotStudies();
                    this.closeModalConfirmation();
                })
                .catch(error => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-REMOVED'));
                });
        } else {
            this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-REMOVED'));
        }
    }

    openModalhealthProfessionals(pilotStudy_id: string) {
        this.pilotStudy_id = pilotStudy_id;
        this.modalService.open('healthProfessionals');
    }

    openModalConfirmation(id: string) {
        this.cacheStudyIdRemove = id;
        this.modalService.open('modalConfirmation');
    }

    closeModalConfirmation() {
        this.cacheStudyIdRemove = '';
        this.modalService.close('modalConfirmation');
    }

    trackById(index, item) {
        return item.id;
    }

}
