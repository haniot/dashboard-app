import {Component, OnInit, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {PageEvent} from '@angular/material';

import {PilotStudy} from 'app/modules/pilot-study/models/pilot.study';
import {PilotStudyService} from 'app/modules/pilot-study/services/pilot-study.service';
import {AuthService} from 'app/security/auth/services/auth.service';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';

@Component({
    selector: 'studies',
    templateUrl: './studies.component.html',
    styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit, AfterViewInit {

    listClass: Array<string>;
    @Output() selected = new EventEmitter();

    userId: string;
    // MatPaginator Inputs
    pageSizeOptions: number[] = [10, 25, 100];

    // MatPaginator Output
    pageEvent: PageEvent;

    /* Controles de paginação */
    page: number = 1;
    limit: number = 10;
    length: number;

    list: Array<PilotStudy>;
    search: string;
    searchTime;

    listOfpilotsIsEmpty: boolean = false;

    cacheStudyIdRemove: string;

    constructor(
        private pilotStudyService: PilotStudyService,
        private authService: AuthService,
        private loadinService: LoadingService
    ) {
        this.list = new Array<PilotStudy>();
        this.listClass = new Array<string>();
    }

    ngOnInit() {
        this.loadUserId();
        this.getAllPilotStudies();
        this.getLengthPilotStudies();
    }

    loadUserId() {
        this.userId = atob(localStorage.getItem('user'));
    }

    getAllPilotStudies() {
        if (this.authService.decodeToken().sub_type == 'admin') {
            this.pilotStudyService.getAll(this.page, this.limit, this.search)
                .then(studies => {
                    this.list = studies;
                    if (studies && studies.length) {
                        this.listOfpilotsIsEmpty = false;
                    } else {
                        this.listOfpilotsIsEmpty = true;
                    }
                })
                .catch(error => {
                    this.listOfpilotsIsEmpty = true;
                    // console.log('Erro ao buscar pilot-studies: ', error);
                });
        } else {
            this.userId = atob(localStorage.getItem('user'));
            this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
                .then(studies => {
                    this.list = studies;
                    if (studies && studies.length) {
                        this.listOfpilotsIsEmpty = false;
                    } else {
                        this.listOfpilotsIsEmpty = true;
                    }
                })
                .catch(error => {
                    this.listOfpilotsIsEmpty = true;
                    // console.log('Erro ao buscar pilot-studies: ', error);
                });
        }
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            if (this.authService.decodeToken().sub_type) {
                this.pilotStudyService.getAll(this.page, this.limit, this.search)
                    .then(studies => {
                        this.list = studies;
                        this.getLengthPilotStudies();
                    })
                    .catch(error => {
                        // console.log('Erro ao buscar pilot-studies: ', error);
                    });
            } else {
                this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
                    .then(studies => {
                        this.list = studies;
                        this.getLengthPilotStudies();
                    })
                    .catch(error => {
                        // console.log('Erro ao buscar pilot-studies: ', error);
                    });
            }
        }, 200);
    }

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        const size = this.pageEvent && this.pageEvent.pageSize ? this.pageEvent.pageSize : this.limit;

        if (this.pageEvent && this.pageEvent.pageIndex) {
            return index + 1 + size * this.pageEvent.pageIndex;
        } else {
            return index + Math.pow(size, 1 - 1);
        }
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllPilotStudies();
        this.listClass = new Array<string>();
    }

    getLengthPilotStudies() {
        if (this.userId) {
            this.pilotStudyService.getAllByUserId(this.userId, undefined, undefined, this.search)
                .then(studies => {
                    this.length = studies.length;
                })
                .catch(error => {
                    // console.log('Erro ao buscar pilot-studies: ', error);
                });
        } else {
            this.pilotStudyService.getAll()
                .then(studies => {
                    this.length = studies.length;
                })
                .catch(error => {
                    // console.log('Erro ao buscar pilot-studies: ', error);
                });
        }
    }

    selectStudy(study_id: string) {
        this.listClass = new Array<string>();
        let local_index = 0;
        this.selected.emit(study_id);
        this.list.forEach((study, index) => {
            if (study.id == study_id) {
                local_index = index;
                return;
            }
        });
        this.listClass[local_index] = 'tr-selected';
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.loadinService.close();
        }, 500);
    }

    getClass(index) {
        this.listClass[index];
    }

}
