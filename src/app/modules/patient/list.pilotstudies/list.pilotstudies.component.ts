import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

import { ISubscription } from 'rxjs/Subscription';

import { PilotStudy } from 'app/modules/pilot.study/models/pilot.study';
import { PilotStudyService } from 'app/modules/pilot.study/services/pilot.study.service';
import { LoadingService } from 'app/shared/shared.components/loading.component/service/loading.service';
import { SelectPilotStudyService } from '../../../shared/shared.components/select.pilotstudy/service/select.pilot.study.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'list-pilotstudies',
    templateUrl: './list.pilotstudies.component.html',
    styleUrls: ['./list.pilotstudies.component.scss']
})
export class ListPilotstudiesComponent implements OnInit, AfterViewChecked, OnDestroy {
    userId: string;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    list: Array<PilotStudy>;
    search: string;
    searchTime;
    private subscriptions: Array<ISubscription>;

    constructor(
        private pilotStudyService: PilotStudyService,
        private paginatorService: PaginatorIntlService,
        private activeRouter: ActivatedRoute,
        private loadinService: LoadingService,
        private selectPilotService: SelectPilotStudyService,
        private router: Router,
        private localStorageService: LocalStorageService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.userId = params.get('userId');
            this.loadPilotSelected();

        }));
    }

    loadUser(): void {
        this.userId = this.localStorageService.getItem('user');
    }

    loadPilotSelected(): void {
        if (!this.userId) {
            this.loadUser();
        }
        const pilotSelected = this.localStorageService.getItem(this.userId);
        if (pilotSelected) {
            this.gotoPatients(pilotSelected);
        } else {
            this.getAllPilotStudies();
        }
    }

    getAllPilotStudies() {
        this.userId = this.localStorageService.getItem('user');
        this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit)
            .then(studies => {
                this.list = studies;
                this.loadinService.close();
                this.getLengthPilotStudies();
            })
            .catch();
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
                .then(studies => {
                    this.list = studies;
                    this.getLengthPilotStudies();
                })
                .catch();
        }, 200);
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

    getLengthPilotStudies() {
        if (this.userId) {
            this.pilotStudyService.getAllByUserId(this.userId, undefined, undefined, this.search)
                .then(studies => {
                    this.length = studies.length;
                })
                .catch();
        } else {
            this.pilotStudyService.getAll()
                .then(studies => {
                    this.length = studies.length;
                })
                .catch();
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
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }


}
