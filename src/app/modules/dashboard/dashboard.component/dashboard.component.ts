import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import * as $ from 'jquery';
import { ISubscription } from 'rxjs/Subscription';

import { Unit } from '../models/unit';
import { PilotStudy } from '../../pilot.study/models/pilot.study';
import { SelectPilotStudyService } from '../../../shared/shared.components/select.pilotstudy/service/select.pilot.study.service';
import { Patient } from '../../patient/models/patient';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { ConfigurationBasic } from '../../config.matpaginator';
import { DashboardService } from '../services/dashboard.service'
import { GenericUser } from '../../../shared/shared.models/generic.user'
import { UserService } from '../../admin/services/users.service'
import { AuthService } from '../../../security/auth/services/auth.service'
import { LoadingService } from '../../../shared/shared.components/loading.component/service/loading.service'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewChecked, OnDestroy {
    /* Patient Paging Settings */
    pageSizeOptionsPatients: number[];
    pagePatients: number;
    limitPatients: number;
    lengthPatients: number;
    pageEventPatients: PageEvent;
    /* Study Paging Settings */
    pageSizeOptionsStudies: number[];
    pageEventStudies: PageEvent;
    pageStudies: number;
    limitStudies: number;
    lengthStudies: number;
    userId: string;
    userLogged: GenericUser;
    patientsTotal: number;
    studiesTotal: number;
    measurementsTotal: number;
    evaluationsTotal: number;
    listPacientsAndWeigth: Array<Unit>;
    listPacients: Array<Patient>;
    listPilots: Array<PilotStudy>;
    pilotStudyId: string;
    listOfStudiesIsEmpty: boolean;
    listOfPatientsIsEmpty: boolean;
    private subscriptions: Array<ISubscription>;

    constructor(
        private dashboardService: DashboardService,
        private authService: AuthService,
        private loadinService: LoadingService,
        private localStorageService: LocalStorageService,
        private selectPilotService: SelectPilotStudyService,
        private userService: UserService
    ) {
        this.patientsTotal = 0;
        this.measurementsTotal = 0;
        this.evaluationsTotal = 0;
        this.listPacientsAndWeigth = new Array<Unit>();
        this.listPilots = new Array<PilotStudy>();
        this.listPacients = new Array<Patient>();
        this.pilotStudyId = '';
        this.listOfStudiesIsEmpty = false;
        this.listOfPatientsIsEmpty = false;
        this.subscriptions = new Array<ISubscription>();
        this.pagePatients = PaginatorConfig.page;
        this.limitPatients = PaginatorConfig.limit;
        this.pageSizeOptionsPatients = PaginatorConfig.pageSizeOptions;
        this.pageStudies = PaginatorConfig.page;
        this.limitStudies = PaginatorConfig.limit;
        this.pageSizeOptionsStudies = PaginatorConfig.pageSizeOptions;
    }


    ngOnInit() {
        $('body').css('background-color', '#ececec');
        this.loadPilotSelected();
        this.subscriptions.push(this.selectPilotService.pilotStudyUpdated.subscribe(() => {
            this.loadPilotSelected();
            this.getPatients();
        }));
        this.load();
    }

    loadPilotSelected(): void {
        if (!this.userId) {
            this.loadUser();
        }
        const pilotselected = this.localStorageService.getItem(this.userId);

        if (pilotselected && pilotselected !== '') {
            this.pilotStudyId = pilotselected;
        } else if (this.authService.decodeToken().sub_type !== 'admin') {
            this.selectPilotService.open();
        }

    }

    loadUser(): void {
        this.userId = this.localStorageService.getItem('user');
        const localUserLogged = this.localStorageService.getItem('userLogged');
        try {
            this.userLogged = JSON.parse(localUserLogged);
            if (!localUserLogged) {
                throw new Error();
            }
        } catch (e) {
            this.userService.getUserById(this.localStorageService.getItem('user'))
                .then(user => {
                    if (user) {
                        this.userLogged = user;
                        this.localStorageService.setItem('userLogged', JSON.stringify(user));
                    }
                })
                .catch();
        }
    }

    load() {
        if (!this.userId || this.userId === '') {
            this.loadUser();
            this.load();
        }

        this.loadPilotSelected();

        if (this.pilotStudyId) {
            this.getPatients();
        }

        this.getStudies();

    }


    clickPaginationPatients(event) {
        this.pageEventPatients = event;
        this.pagePatients = event.pageIndex + 1;
        this.limitPatients = event.pageSize;
        this.getPatients();
    }

    clickPaginationStudies(event) {
        this.pageEventStudies = event;
        this.pageStudies = event.pageIndex + 1;
        this.limitStudies = event.pageSize;
    }

    getPatients() {
        if (!this.pilotStudyId) {
            this.loadPilotSelected();
        }
        this.dashboardService.getAllPatients(this.pilotStudyId, this.pagePatients, this.limitPatients)
            .then(httpResponse => {
                this.lengthPatients = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    this.listPacients = httpResponse.body;
                }
                this.listOfPatientsIsEmpty = !(this.listPacients && this.listPacients.length);
            })
            .catch();
    }

    getStudies() {
        if (!this.userId) {
            this.loadUser();
        }
        this.dashboardService.getAllStudiesByUserId(this.userId, this.pageStudies, this.limitStudies)
            .then(httpResponse => {
                this.lengthStudies = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (!this.lengthStudies) {
                    this.lengthStudies = 0;
                }
                if (httpResponse.body && httpResponse.body.length) {
                    this.listPilots = httpResponse.body;
                }
                this.listOfStudiesIsEmpty = !(this.listPilots && this.listPilots.length);
            })
            .catch();
    }

    isNotUserAdmin(): boolean {
        return this.authService.decodeToken().sub_type !== 'admin';
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

