import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

import { ISubscription } from 'rxjs/Subscription';

import { SelectPilotStudyService } from '../../../shared/shared.components/select.pilotstudy/service/select.pilot.study.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config.matpaginator'
import { PilotStudy } from '../../pilot.study/models/pilot.study'
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'list-pilotstudies',
    templateUrl: './list.pilotstudies.component.html',
    styleUrls: ['./list.pilotstudies.component.scss']
})
export class ListPilotstudiesComponent implements OnInit, OnDestroy {
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
        private selectPilotService: SelectPilotStudyService,
        private router: Router,
        private localStorageService: LocalStorageService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.list = new Array<PilotStudy>();
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
            this.gotoPatients();
        } else {
            this.getAllPilotStudies();
        }
    }

    getAllPilotStudies() {
        this.userId = this.localStorageService.getItem('user');
        this.list = [];
        this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit)
            .then(httpResponse => {
                this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    this.list = httpResponse.body;
                }
                // this.loadinService.close();
            })
            .catch();
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.list = [];
            this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit, this.search)
                .then(httpResponse => {
                    this.length = parseInt(httpResponse.headers.get('x-total-count'), 10);
                    if (httpResponse.body && httpResponse.body.length) {
                        this.list = httpResponse.body;
                    }
                })
                .catch();
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

    gotoPatients() {
        this.router.navigate(['/app/patients']);
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }


}
