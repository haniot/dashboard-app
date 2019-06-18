import {Component, OnInit, AfterViewChecked, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";

import * as $ from 'jquery';
import {ISubscription} from 'rxjs/Subscription';

import {DashboardService} from '../services/dashboard.service';
import {AuthService} from 'app/security/auth/services/auth.service';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';
import {ToastrService} from "ngx-toastr";
import {Unit} from "../models/unit";
import {PilotStudy} from "../../pilot-study/models/pilot.study";
import {SelectPilotStudyService} from "../../../shared/shared-components/select-pilotstudy/service/select-pilot-study.service";
import {Patient} from "../../patient/models/patient";
import {PageEvent} from '@angular/material/paginator';
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewChecked, OnDestroy {
    /* Configurações de paginação dos pacientes */
    // MatPaginator Inputs
    pageSizeOptionsPatients: number[] = [10, 25, 100];

    // MatPaginator Output
    pageEventPatients: PageEvent;

    /* Controles de paginação */
    pagePatients: number = 1;
    limitPatients: number = 10;
    lengthPatients: number;

    /* Configurações de paginação dos estudos */
    // MatPaginator Inputs
    pageSizeOptionsStudies: number[] = [10, 25, 100];

    // MatPaginator Output
    pageEventStudies: PageEvent;

    /* Controles de paginação */
    pageStudies: number = 1;
    limitStudies: number = 10;
    lengthStudies: number;

    userId: string;

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
        private toastService: ToastrService,
        private selectPilotService: SelectPilotStudyService,
        private router: Router
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
        // this.getStudies();
    }

    getPatients() {
        if (!this.pilotStudyId) {
            this.loadPilotSelected();
        }
        this.dashboardService.getAllPatients(this.pilotStudyId, this.pagePatients, this.limitPatients)
            .then(patients => {
                this.listPacients = patients;
                this.calcLengthPatients();
                if (patients.length) {
                    this.listOfPatientsIsEmpty = false;
                } else {
                    this.listOfPatientsIsEmpty = true;
                }
            })
    }

    calcLengthPatients() {
        this.dashboardService.getAllPatients(this.pilotStudyId, undefined, undefined)
            .then(patients => {
                this.lengthPatients = patients.length;
            })
            .catch(errorResponse => {
                // console.log('Não foi possível buscar todos os pacientes',errorResponse);
            });
    }

    getStudies() {
        if (!this.userId) {
            this.loadUser();
        }
        this.dashboardService.getAllStudiesByUserId(this.userId, this.pageStudies, this.limitStudies)
            .then(studies => {
                this.listPilots = studies;
                this.calcLengthStudies();
                if (studies.length) {
                    this.listOfStudiesIsEmpty = false;
                } else {
                    this.listOfStudiesIsEmpty = true;
                }
            })
    }

    calcLengthStudies() {

        if (this.isNotUserAdmin()) {
            this.dashboardService.getNumberOfStudies(this.userId)
                .then(numberOfStudies => {
                    this.lengthStudies = numberOfStudies;
                    this.studiesTotal = numberOfStudies;

                })
                .catch(errorResponse => {
                    // console.log('Não foi possível buscar todos os pacientes',errorResponse);
                });
        } else {
            this.dashboardService.getInfoByUser(this.userId)
                .then((response: { studiesTotal: number, patientsTotal: number }) => {
                    if (response) {
                        this.studiesTotal = response.studiesTotal;
                        this.lengthStudies = response.studiesTotal;
                        this.patientsTotal = response.patientsTotal;
                    }
                })
                .catch(error => {
                    this.toastService.error('Não foi possível carregar informações!')
                });
        }


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
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }


}

