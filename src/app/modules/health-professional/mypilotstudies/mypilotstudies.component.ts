import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';

import {PilotStudyService} from 'app/modules/pilot-study/services/pilot-study.service';
import {ModalService} from 'app/shared/shared-components/haniot-modal/service/modal.service';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';
import {PilotStudy} from 'app/modules/pilot-study/models/pilot.study';
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";

@Component({
    selector: 'mypilotstudies',
    templateUrl: './mypilotstudies.component.html',
    styleUrls: ['./mypilotstudies.component.scss']
})
export class MypilotstudiesComponent implements OnInit, AfterViewChecked {

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

    cacheStudyIdRemove: string;

    listOfStudiesIsEmpty: boolean;

    constructor(
        private pilotStudyService: PilotStudyService,
        private loadinService: LoadingService,
        private router: Router,
        private modalService: ModalService,
        private toastService: ToastrService,
        private localStorageService: LocalStorageService
    ) {
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
        this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
            .then(studies => {
                this.list = studies;
                this.getLengthPilotStudies();
                if (studies.length) {
                    this.listOfStudiesIsEmpty = false;
                } else {
                    this.listOfStudiesIsEmpty = true;
                }
            })
            .catch(error => {
                this.listOfStudiesIsEmpty = true;
                // console.log('Erro ao buscar pilot-studies: ', error);
            });
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
                .then(studies => {
                    this.list = studies;
                    this.getLengthPilotStudies();
                    if (studies.length) {
                        this.listOfStudiesIsEmpty = false;
                    } else {
                        this.listOfStudiesIsEmpty = true;
                    }
                })
                .catch(error => {
                    this.listOfStudiesIsEmpty = true;
                    // console.log('Erro ao buscar pilot-studies: ', error);
                });
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

    // newPilotStudy() {
    //     this.router.navigate(['/pilotstudies/new']);
    // }

    removeStudy() {
        if (this.cacheStudyIdRemove) {
            this.pilotStudyService.remove(this.cacheStudyIdRemove)
                .then(() => {
                    this.toastService.info('Estudo removido com sucesso!');
                    this.getAllPilotStudies();
                    this.getLengthPilotStudies();
                    this.closeModalConfirmation();
                })
                .catch(error => {
                    this.toastService.error('Não foi possível remover estudo!');
                });
        } else {
            this.toastService.error('Não foi possível remover estudo!');
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

    ngAfterViewChecked() {
        this.loadinService.close();
    }

}

