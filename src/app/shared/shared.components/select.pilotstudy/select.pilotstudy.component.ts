import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { PilotStudyService } from '../../../modules/pilot.study/services/pilot.study.service';
import { PilotStudy } from '../../../modules/pilot.study/models/pilot.study';
import { LoadingService } from '../loading.component/service/loading.service';
import { SelectPilotStudyService } from './service/select.pilot.study.service';
import { AuthService } from '../../../security/auth/services/auth.service';
import { LocalStorageService } from '../../shared.services/local.storage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../../modules/config.matpaginator'
import { UserService } from '../../../modules/admin/services/users.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'select-pilotstudy',
    templateUrl: './select.pilotstudy.component.html',
    styleUrls: ['./select.pilotstudy.component.scss']
})
export class SelectPilotstudyComponent implements OnInit, AfterViewChecked {
    /* Paging Settings */
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    list: Array<PilotStudy>;
    search: string;
    searchTime;
    listOfStudiesIsEmpty: boolean;
    userId: string;
    userName = '';

    constructor(
        private pilotStudyService: PilotStudyService,
        private paginatorService: PaginatorIntlService,
        private activeRouter: ActivatedRoute,
        private loadinService: LoadingService,
        private selecPilotService: SelectPilotStudyService,
        private selectPilot: SelectPilotStudyService,
        private authService: AuthService,
        private userService: UserService,
        private localStorageService: LocalStorageService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.listOfStudiesIsEmpty = false;
        this.list = new Array<PilotStudy>();
    }

    ngOnInit() {
        this.getUser();
        if (this.authService.decodeToken().sub_type === 'admin') {
            this.selecPilotService.close();
        }
        this.getAllPilotStudies();
    }

    loadUser(): void {
        const user_id = this.localStorageService.getItem('user');

        if (user_id) {
            this.userId = user_id;
        }
    }

    getAllPilotStudies() {
        if (!this.userId) {
            this.loadUser();
        }

        if (this.userId) {
            this.pilotStudyService.getAllByUserId(this.userId, this.page, this.limit)
                .then(studies => {
                    this.list = studies;
                    this.getLengthPilotStudies();
                    this.loadinService.close();
                    if (studies.length) {
                        this.listOfStudiesIsEmpty = false;
                    } else {
                        this.listOfStudiesIsEmpty = true;
                    }
                })
                .catch(() => {
                    this.listOfStudiesIsEmpty = true;
                });
        }
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
        if (this.userId && this.userId !== '') {
            this.pilotStudyService.getAllByUserId(this.userId, undefined, undefined, this.search)
                .then(studies => {
                    this.length = studies.length;
                })
                .catch();
        }
    }

    selectPilotStudy(pilotstudy_id: string): void {
        if (!this.userId) {
            this.loadUser();
        }
        this.localStorageService.setItem(this.userId, pilotstudy_id);
        this.selecPilotService.pilotStudyHasUpdated();
        this.selectPilot.close();
    }


    getUser() {
        this.userId = this.localStorageService.getItem('user');
        const localUserLogged = JSON.parse(this.localStorageService.getItem('userLogged'));
        try {
            const username = localUserLogged.name ? localUserLogged.name : localUserLogged.email;
            this.userName = username;
        } catch (e) {
            this.userService.getUserById(this.localStorageService.getItem('user'))
                .then(user => {
                    if (user) {
                        this.userName = user.name ? user.name : user.email;
                        const health_area = user.health_area ? user.health_area : 'admin';
                        this.localStorageService.setItem('userLogged', JSON.stringify(user));
                        this.localStorageService.setItem('email', user.email);
                        this.localStorageService.setItem('health_area', health_area);
                        this.localStorageService.setItem('language', user.language);
                    }
                })
                .catch();
        }

    }

    closeModal() {
        this.selecPilotService.close();
    }

    trackById(index, item) {
        return item.id;
    }

    ngAfterViewChecked() {
        this.loadinService.close();
    }

}
