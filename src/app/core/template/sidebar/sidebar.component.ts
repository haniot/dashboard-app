import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { AuthService } from '../../../security/auth/services/auth.service'
import { VerifyScopeService } from '../../../security/services/verify.scope.service'
import { UserService } from '../../../modules/admin/services/users.service'
import { Location } from '@angular/common'
import { PilotStudy } from '../../../modules/pilot.study/models/pilot.study'
import { SelectPilotStudyService } from '../../../shared/shared.components/select.pilotstudy/service/select.pilot.study.service'
import { PilotStudyService } from '../../../modules/pilot.study/services/pilot.study.service'
import { GenericUser } from '../../../shared/shared.models/generic.user'
import { EnumMeasurementType } from '../../../modules/measurement/models/measurement'

declare const $: any;

export const configSideBar = [
    { title: 'Dashboard', scopes: [] },
    {
        title: 'Users',
        scopes: ['admins:create', 'admins:delete', 'admins:readAll', 'admins:update',
            'healthprofessionals:create', 'healthprofessionals:readAll', 'healthprofessionals:update', 'healthprofessionals:delete']
    },
    {
        title: 'Administrators',
        scopes: ['admins:create', 'admins:delete', 'admins:readAll', 'admins:update']
    },
    {
        title: 'HealthProfessionals',
        scopes: ['healthprofessionals:create', 'healthprofessionals:delete', 'healthprofessionals:readAll', 'healthprofessionals:update']
    },
    {
        title: 'PilotStudies',
        scopes: ['pilots:readAll', 'pilots:create', 'pilots:delete', 'pilots:update']
    },
    {
        title: 'Patients',
        scopes: ['patients:create', 'patients:read', 'patients:update', 'patients:delete']
    },
    {
        title: 'MyStudies',
        scopes: []
    },
    {
        title: 'MyEvaluations',
        scopes: []
    },
    {
        title: 'Evaluations',
        scopes: ['evaluations:read']
    }
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    userId: string;
    patientSelected: string;
    configSideBar: { title: string, scopes: any[] }[];
    userName: String = '';
    iconUserMenu = 'keyboard_arrow_right';
    activeMyPilots: string;
    activeMyEvaluations: string;
    activeHome: string;
    activePatients: string;
    activeDashboardPatients: string;
    activeMeasurementsPatients: string;
    activeCorrelatePatients: string;
    activeQuestionnairesPatients: string;
    activeEvaluations: string;
    study: PilotStudy;
    iconCollapse = 'keyboard_arrow_up';
    userLogged: GenericUser;
    loadUserTime: any
    iconPatientMenu = 'keyboard_arrow_right';
    statePatientMenu: string;

    constructor(
        private authService: AuthService,
        private verifyScopesService: VerifyScopeService,
        private userService: UserService,
        private localStorageService: LocalStorageService,
        private selectPilotService: SelectPilotStudyService,
        private studyService: PilotStudyService,
        private router: Router,
        private activedRoute: ActivatedRoute,
        private location: Location
    ) {
        this.userLogged = new GenericUser('');
        this.study = new PilotStudy();
    }

    ngOnInit() {
        this.getPatientSelected();
        this.configSideBar = configSideBar;
        this.getUserName();
        this.router.events.subscribe(event => this.updateMenu());
        this.activedRoute.paramMap.subscribe(() => this.updateMenu());
        this.selectPilotService.pilotStudyUpdated.subscribe(() => {
            this.getPilotSelected();
        });
        this.localStorageService.patientSelected.subscribe(() => {
            this.getPatientSelected();
        });
    }

    getPatientSelected(): void {
        const patientSelectedLocal = JSON.parse(this.localStorageService.getItem('patientSelected'));
        this.patientSelected = patientSelectedLocal && patientSelectedLocal.id ? patientSelectedLocal.id : '';
        this.statePatientMenu = this.patientSelected ? 'show' : '';
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    verifyScopes(title: string): boolean {
        const configRouter = this.configSideBar.filter((element) => {
            return element.title === title;
        });
        const routerScopes = configRouter[0].scopes;
        return this.verifyScopesService.verifyScopes(routerScopes);
    }

    getUserName() {
        this.loadUserTime = setInterval(() => {
            this.userId = this.localStorageService.getItem('user');
            const localUserLogged = JSON.parse(this.localStorageService.getItem('userLogged'));
            let username = '';
            try {
                this.userLogged = localUserLogged;
                username = localUserLogged.name ? localUserLogged.name : localUserLogged.email;
                this.userName = username;
                clearInterval(this.loadUserTime)
            } catch (e) {

            }
        }, 1000)
    }

    getPilotSelected(): void {
        const pilotselected = this.localStorageService.getItem(this.userId);
        if (pilotselected) {
            this.studyService.getById(pilotselected)
                .then(study => {
                    this.study = study;
                })
                .catch(() => {

                });
        }

    }

    updateMenu() {
        const path_current = this.location.path();
        this.activeHome = path_current.match('/app/dashboard\$') ? 'active' : '';
        this.activeMyPilots = (path_current.match('mystudies\$') || path_current.match('pilotstudies')) ? 'active' : '';
        this.activeMyEvaluations = (path_current.match('myevaluations\$')) ? 'active' : '';
        this.activePatients = (path_current.match('patients') || path_current.match('activities')) ? 'active' : '';
        this.activeEvaluations = (path_current.match('evaluations') && path_current.match('nutritional')) ? 'active' : '';

        this.activeDashboardPatients = (
            (path_current.match('patients') && path_current.match('dashboard')) ||
            (path_current.match('activities') && path_current.match('physical_activity|sleep'))
        ) ? 'active' : '';
        const measurements = Object.keys(EnumMeasurementType);
        const regex = measurements.join('|')
        this.activeMeasurementsPatients = (
            path_current.match('patients') &&
            (path_current.match('measurements\$|' + regex))
        ) ? 'active' : '';
        this.activeQuestionnairesPatients = (path_current.match('patients') && path_current.match('questionnaires\$')) ? 'active' : '';
        this.activeCorrelatePatients = (path_current.match('patients') && path_current.match('correlate')) ? 'active' : '';
    }

    myPilotStudies(): void {
        switch (this.getTypeUser()) {
            case 'health_professional':
                this.router.navigate(['/app/healthprofessional/mystudies']);
                break;
            case 'patient':
                this.router.navigate(['/app/patients/mystudies']);
                break;
        }
    }

    collapse() {
        this.iconCollapse = this.iconCollapse === 'keyboard_arrow_up' ? 'keyboard_arrow_down' : 'keyboard_arrow_up';
        if (this.iconCollapse === 'keyboard_arrow_up') {
            $('#collapseStudy').collapse('hide');
        } else {
            $('#collapseStudy').collapse('show');
        }
    }

    myEvaluations(): void {
        switch (this.getTypeUser()) {
            case 'health_professional':
                this.router.navigate(['/app/healthprofessional/myevaluations']);
                break;
            case 'patient':
                this.router.navigate(['/app/patients/myevaluations']);
                break;
        }
    }

    nutritionalEvaluations(): void {
        this.router.navigate(['/app/evaluations/nutritional']);
    }

    logout() {
        this.authService.logout();
    }

    onClickMenuUser(): void {
        this.iconUserMenu = this.iconUserMenu === 'keyboard_arrow_down' ? 'keyboard_arrow_right' : 'keyboard_arrow_down';
    }

    changeIconMenuPatient(): void {
        this.iconPatientMenu = this.iconPatientMenu === 'keyboard_arrow_down' ? 'keyboard_arrow_right' : 'keyboard_arrow_down';
        this.statePatientMenu = this.iconPatientMenu === 'keyboard_arrow_right' ? 'show' : '';
    }

    onClickMenuPatient(event): void {
        event.preventDefault();
        event.stopPropagation();
        this.router.navigate(['/app/patients']);
    }

    isNotAdmin(): boolean {
        return this.getTypeUser() !== 'admin';
    }

    config(): void {
        switch (this.getTypeUser()) {
            case 'admin':
                this.router.navigate(['/app/admin/configurations']);
                break;

            case 'health_professional':
                this.router.navigate(['/app/healthprofessional/configurations']);
                break;

            case 'patient':
                this.router.navigate(['/app/patients/configurations']);
                break;
        }
    }

    getTypeUser(): string {
        return this.authService.decodeToken().sub_type;
    }
}
