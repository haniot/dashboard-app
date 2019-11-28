import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';

import * as $ from 'jquery';
import { ISubscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'

import { PilotStudy } from '../../pilot.study/models/pilot.study';
import { SelectPilotStudyService } from '../../../shared/shared.components/select.pilotstudy/service/select.pilot.study.service';
import { Patient } from '../../patient/models/patient';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { DashboardService } from '../services/dashboard.service';
import { GenericUser } from '../../../shared/shared.models/generic.user';
import { UserService } from '../../admin/services/users.service';
import { AuthService } from '../../../security/auth/services/auth.service';
import { LoadingService } from '../../../shared/shared.components/loading.component/service/loading.service';
import { NutritionEvaluation } from '../../evaluation/models/nutrition-evaluation';
import { ConfigurationBasic } from '../../config.matpaginator'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewChecked, OnDestroy {
    pagePatients: number;
    limitPatients: number;
    lengthPatients: number;
    pageStudies: number;
    limitStudies: number;
    lengthStudies: number;
    pageEvaluations: number;
    limitEvaluations: number;
    lengthEvaluations: number;
    userId: string;
    userLogged: GenericUser;
    patientsTotal: number;
    measurementsTotal: number;
    evaluationsTotal: number;
    listPatients: Array<Patient>;
    listPilots: Array<PilotStudy>;
    listEvaluations: Array<NutritionEvaluation>;
    pilotStudyId: string;
    listOfStudiesIsEmpty: boolean;
    listOfPatientsIsEmpty: boolean;
    listOfEvaluatioinsIsEmpty: boolean;
    private subscriptions: Array<ISubscription>;

    constructor(
        private dashboardService: DashboardService,
        private authService: AuthService,
        private loadinService: LoadingService,
        private localStorageService: LocalStorageService,
        private selectPilotService: SelectPilotStudyService,
        private userService: UserService,
        private toastService: ToastrService,
        private translateService: TranslateService
    ) {
        this.patientsTotal = 0;
        this.measurementsTotal = 0;
        this.evaluationsTotal = 0;
        this.listPilots = new Array<PilotStudy>();
        this.listPatients = new Array<Patient>();
        this.listEvaluations = new Array<NutritionEvaluation>();
        this.pilotStudyId = '';
        this.listOfStudiesIsEmpty = false;
        this.listOfPatientsIsEmpty = false;
        this.listOfEvaluatioinsIsEmpty = false;
        this.subscriptions = new Array<ISubscription>();
        this.userId = this.localStorageService.getItem('user');
        this.pagePatients = PaginatorConfig.page;
        this.pageStudies = PaginatorConfig.page;
        this.pageEvaluations = PaginatorConfig.page;
        this.limitPatients = 8;
        this.limitStudies = 4;
        this.limitEvaluations = 4;
        this.selectPilotService.pilotStudyUpdated.subscribe(() => {
            this.load();
        })
        this.dashboardService.userLoggedUpdated.subscribe(() => {
            this.requestUserLogged();
        })
    }

    ngOnInit() {
        this.load();
    }

    load() {
        if (!this.userId || this.userId === '') {
            this.loadUser();
        }

        this.loadPilotSelected();

        this.getStudies();

        if (this.getUserType() === 'patient') {
            this.getEvaluations();
        }

    }

    loadPilotSelected(): void {
        this.loadUser()
            .then(() => {
                const pilotselected = this.localStorageService.getItem(this.userId);
                if (pilotselected && pilotselected !== '') {
                    this.pilotStudyId = pilotselected;
                    if (this.authService.decodeToken().sub_type !== 'admin') {
                        this.getPatients();
                    }
                } else if (this.authService.decodeToken().sub_type !== 'admin' && !this.userLogged.selected_pilot_study) {
                    this.selectPilotService.open();
                }
            })
            .catch(() => {
            });

    }

    loadUser(): Promise<any> {
        if (!this.userId || !this.userLogged) {
            this.userId = this.localStorageService.getItem('user');
            const localUserLogged = this.localStorageService.getItem('userLogged');
            try {
                this.userLogged = JSON.parse(localUserLogged);
                if (!localUserLogged) {
                    throw new Error();
                }
                return Promise.resolve(this.userLogged);
            } catch (e) {
                return this.requestUserLogged()
            }
        }
        return Promise.resolve(this.userLogged);

    }

    requestUserLogged(): Promise<any> {
        return this.userService.getUserById(this.localStorageService.getItem('user'))
            .then(user => {
                if (user) {
                    this.userId = user.id;
                    this.userLogged = user;
                    this.localStorageService.setItem('userLogged', JSON.stringify(user));
                    this.localStorageService.setItem(this.userLogged.id, this.userLogged.selected_pilot_study);
                    this.selectPilotService.pilotStudyHasUpdated(this.userLogged.selected_pilot_study);
                }
            })
            .catch(() => {
            });
    }

    getPatients() {
        if (!this.pilotStudyId) {
            return this.loadPilotSelected();
        }
        this.listPatients = [];
        this.dashboardService.getAllPatients(this.pilotStudyId, this.pagePatients, this.limitPatients)
            .then(httpResponse => {
                this.lengthPatients = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (httpResponse.body && httpResponse.body.length) {
                    this.listPatients = httpResponse.body;
                }
                this.listOfPatientsIsEmpty = !(this.listPatients && this.listPatients.length);
            })
            .catch(() => {
                this.lengthPatients = 0;
                this.listOfPatientsIsEmpty = true;
            });
    }

    getStudies() {
        if (!this.userId) {
            this.loadUser();
        }
        this.listPilots = [];
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
            .catch(() => {
                this.lengthStudies = 0;
                this.listOfStudiesIsEmpty = true;
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.INFO-NOT-LOAD'));
            });
    }

    getEvaluations() {
        if (!this.userId) {
            this.loadUser();
        }
        this.listEvaluations = [];
        this.dashboardService.getAllEvaluations(this.userId, this.pageEvaluations, this.limitEvaluations)
            .then(httpResponse => {
                this.lengthEvaluations = parseInt(httpResponse.headers.get('x-total-count'), 10);
                if (!this.lengthEvaluations) {
                    this.lengthEvaluations = 0;
                }
                if (httpResponse.body && httpResponse.body.length) {
                    this.listEvaluations = httpResponse.body;
                }
                this.listOfEvaluatioinsIsEmpty = !(this.listEvaluations && this.listEvaluations.length);
            })
            .catch(() => {
                this.lengthEvaluations = 0;
                this.listOfEvaluatioinsIsEmpty = true;
            });
    }

    getUserType(): string {
        return this.authService.decodeToken().sub_type;
    }

    openLoading(): void {
        this.loadinService.open();
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

