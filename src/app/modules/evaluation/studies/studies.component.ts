import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material';

import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { PilotStudy } from '../../pilot.study/models/pilot.study'
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service'
import { AuthService } from '../../../security/auth/services/auth.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'studies',
    templateUrl: './studies.component.html',
    styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {
    @Output() selected = new EventEmitter();
    userId: string;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    list: Array<PilotStudy>;
    search: string;
    searchTime;
    listClass: Array<string>;
    listOfPilotsIsEmpty: boolean;

    constructor(
        private pilotStudyService: PilotStudyService,
        private authService: AuthService,
        private paginatorService: PaginatorIntlService,
        private localStorageService: LocalStorageService,
        private toastService: ToastrService,
        private translateService: TranslateService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.listOfPilotsIsEmpty = false;
        this.list = new Array<PilotStudy>();
        this.listClass = new Array<string>();
    }

    ngOnInit() {
        this.loadUserId();
        this.getAllPilotStudies();
    }

    loadUserId() {
        this.userId = this.localStorageService.getItem('user');
    }

    getAllPilotStudies() {
        this.list = [];
        if (this.authService.decodeToken().sub_type === 'admin') {
            this.pilotStudyService.getAll(this.page, this.limit, this.search)
                .then(httpResponse => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                    if (httpResponse.body && httpResponse.body.length) {
                        this.list = httpResponse.body;
                    }
                    this.listOfPilotsIsEmpty = !(this.list && this.list.length);
                })
                .catch(() => {
                    this.listOfPilotsIsEmpty = true;
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.INFO-NOT-LOAD'));
                });
        } else {
            this.userId = this.localStorageService.getItem('user');
            this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
                .then(httpResponse => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                    if (httpResponse.body && httpResponse.body.length) {
                        this.list = httpResponse.body;
                    }
                    this.listOfPilotsIsEmpty = !(this.list && this.list.length);
                })
                .catch(() => {
                    this.listOfPilotsIsEmpty = true;
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.INFO-NOT-LOAD'));
                });
        }
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.list = [];
            if (this.authService.decodeToken().sub_type) {
                this.pilotStudyService.getAll(null, this.limit, this.search)
                    .then(httpResponse => {
                        this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                        if (httpResponse.body && httpResponse.body.length) {
                            this.list = httpResponse.body;
                        }
                    })
                    .catch();
            } else {
                this.pilotStudyService.getAllByUserId(this.userId, null, this.limit, this.search)
                    .then(httpResponse => {
                        this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                        if (httpResponse.body && httpResponse.body.length) {
                            this.list = httpResponse.body;
                        }

                    })
                    .catch();
            }
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
        this.listClass = new Array<string>();
    }

    selectStudy(study_id: string) {
        this.listClass = new Array<string>();
        let local_index = 0;
        this.selected.emit(study_id);
        this.list.forEach((study, index) => {
            if (study.id === study_id) {
                local_index = index;
                return;
            }
        });
        this.listClass[local_index] = 'tr-selected';
    }

    trackById(index, item) {
        return item.id;
    }
}
