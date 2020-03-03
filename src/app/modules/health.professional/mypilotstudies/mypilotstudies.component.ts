import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { PilotStudy } from '../../pilot.study/models/pilot.study'
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'mypilotstudies',
    templateUrl: './mypilotstudies.component.html',
    styleUrls: ['./mypilotstudies.component.scss']
})
export class MypilotstudiesComponent implements OnInit {
    userId: string;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    list: Array<PilotStudy>;
    search: string;
    searchTime;
    cacheStudyIdRemove: string;
    listOfStudiesIsEmpty: boolean;

    constructor(
        private pilotStudyService: PilotStudyService,
        private router: Router,
        private modalService: ModalService,
        private paginatorService: PaginatorIntlService,
        private toastService: ToastrService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.list = new Array<PilotStudy>();
        this.listOfStudiesIsEmpty = false;
    }

    ngOnInit() {
        this.loadUserId();
        this.getAllPilotStudies();
    }

    loadUserId() {
        this.userId = this.localStorageService.getItem('user');
    }

    getAllPilotStudies() {
        this.userId = this.localStorageService.getItem('user');
        this.list = [];
        this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
            .then(httpResponse => {
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    this.list = httpResponse.body;
                }
                this.listOfStudiesIsEmpty = !(this.list && this.list.length);
            })
            .catch(() => {
                this.listOfStudiesIsEmpty = true;
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.INFO-NOT-LOAD'));
            });
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.list = [];
            this.pilotStudyService.getAllByUserId(this.userId, null, this.limit, this.search)
                .then(httpResponse => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                    if (httpResponse.body && httpResponse.body.length) {
                        this.list = httpResponse.body;
                    }
                    this.listOfStudiesIsEmpty = !(this.list && this.list.length);
                })
                .catch(() => {
                    this.listOfStudiesIsEmpty = true;
                });
        }, 500);
    }

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        return this.paginatorService.getIndex(this.pageEvent, this.limit, index);
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllPilotStudies();
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

