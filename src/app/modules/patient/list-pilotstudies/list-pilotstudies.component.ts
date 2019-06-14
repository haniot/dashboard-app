import {Component, OnInit, AfterViewInit, AfterViewChecked, OnDestroy} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';

import {ISubscription} from 'rxjs/Subscription';

import {PilotStudy} from 'app/modules/pilot-study/models/pilot.study';
import {PilotStudyService} from 'app/modules/pilot-study/services/pilot-study.service';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';
import {SelectPilotStudyService} from "../../../shared/shared-components/select-pilotstudy/service/select-pilot-study.service";

@Component({
    selector: 'list-pilotstudies',
    templateUrl: './list-pilotstudies.component.html',
    styleUrls: ['./list-pilotstudies.component.scss']
})
export class ListPilotstudiesComponent implements OnInit, AfterViewChecked, OnDestroy {
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

    private subscriptions: Array<ISubscription>;

    constructor(
        private pilotStudyService: PilotStudyService,
        private activeRouter: ActivatedRoute,
        private loadinService: LoadingService,
        private selectPilotService: SelectPilotStudyService,
        private router: Router
    ) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.userId = params.get('userId');
            this.loadPilotSelected();

        }));
    }

    loadUser(): void {
        this.userId = atob(localStorage.getItem('user'));
    }

    loadPilotSelected(): void {
        if (!this.userId) {
            this.loadUser();
        }
        const pilotselected = localStorage.getItem(this.userId);
        if (pilotselected) {
            this.gotoPatients(pilotselected);
        } else {
            this.getAllPilotStudies();
        }
    }

    getAllPilotStudies() {
        this.userId = atob(localStorage.getItem('user'));
        this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit)
            .then(studies => {
                this.list = studies;
                this.loadinService.close();
                this.getLengthPilotStudies();
            })
            .catch(errorResponse => {
                // console.log('Erro ao buscar pilot-studies: ', errorResponse);
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
                    // console.log('Erro ao buscar pilot-studies: ', errorResponse);
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
                    // console.log('Erro ao buscar pilot-studies: ', errorResponse);
                });
        } else {
            this.pilotStudyService.getAll()
                .then(studies => {
                    this.length = studies.length;
                })
                .catch(errorResponse => {
                    // console.log('Erro ao buscar pilot-studies: ', errorResponse);
                });
        }
    }

    gotoPatients(pilotstudy_id: string) {
        this.router.navigate(['/patients', pilotstudy_id]);
    }

    trackById(index, item) {
        return item.id;
    }

    ngAfterViewChecked() {
        this.loadinService.close();
    }

    ngOnDestroy(): void {
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }


}
