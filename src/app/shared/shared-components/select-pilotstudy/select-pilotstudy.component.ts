import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {PilotStudyService} from "../../../modules/pilot-study/services/pilot-study.service";
import {PilotStudy} from "../../../modules/pilot-study/models/pilot.study";
import {PageEvent} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../loading-component/service/loading.service";
import {SelectPilotStudyService} from "./service/select-pilot-study.service";

@Component({
    selector: 'select-pilotstudy',
    templateUrl: './select-pilotstudy.component.html',
    styleUrls: ['./select-pilotstudy.component.scss']
})
export class SelectPilotstudyComponent implements OnInit, AfterViewChecked {

    userId: string;
    // MatPaginator Inputs
    pageSizeOptions: number[] = [10, 25, 100];

    // MatPaginator Output
    pageEvent: PageEvent;

    /* Controles de paginação */
    page = 1;
    limit = 10;
    length: number;

    list: Array<PilotStudy>;
    search: string;
    searchTime;

    constructor(
        private pilotStudyService: PilotStudyService,
        private activeRouter: ActivatedRoute,
        private loadinService: LoadingService,
        private selectPilot: SelectPilotStudyService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.userId = params.get('userId');
            this.getAllPilotStudies();
            this.getLengthPilotStudies();
        });
        const pilotstudy_id = localStorage.getItem('pilotstudi_id');
        if (pilotstudy_id && pilotstudy_id !== '') {
            this.gotoPatients(pilotstudy_id);
        }
        this.getAllPilotStudies();
        this.getLengthPilotStudies();
    }

    getAllPilotStudies() {
        this.userId = atob(localStorage.getItem('user'));
        this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit)
            .then(studies => {
                this.list = studies;
                this.loadinService.close();
            })
            .catch(errorResponse => {
                console.log('Erro ao buscar pilot-studies: ', errorResponse);
            });
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
                .then(studies => {
                    this.list = studies;
                    this.getLengthPilotStudies();
                })
                .catch(errorResponse => {
                    console.log('Erro ao buscar pilot-studies: ', errorResponse);
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
                .catch(errorResponse => {
                    console.log('Erro ao buscar pilot-studies: ', errorResponse);
                });
        } else {
            this.pilotStudyService.getAll()
                .then(studies => {
                    this.length = studies.length;
                })
                .catch(errorResponse => {
                    console.log('Erro ao buscar pilot-studies: ', errorResponse);
                });
        }
    }

    selectPilotStudy(pilotstudy_id: string): void {
        localStorage.setItem('pilotstudi_id', pilotstudy_id);
        this.selectPilot.close();

    }

    gotoPatients(pilotstudy_id: string) {
        this.router.navigate(['/patients', pilotstudy_id]);
    }

    ngAfterViewChecked() {
        this.loadinService.close();
    }

}
