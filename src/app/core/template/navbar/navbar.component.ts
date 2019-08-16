import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { ISubscription } from 'rxjs-compat/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { PilotStudy } from '../../../modules/pilot.study/models/pilot.study';
import { SelectPilotStudyService } from '../../../shared/shared.components/select.pilotstudy/service/select.pilot.study.service';
import { PilotStudyService } from '../../../modules/pilot.study/services/pilot.study.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { LoadingService } from '../../../shared/shared.components/loading.component/service/loading.service';
import { AuthService } from '../../../security/auth/services/auth.service'
import { UserService } from '../../../modules/admin/services/users.service'


export declare interface RouteInfo {
    path: string;
    title: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '^/app/dashboard$', title: 'SHARED.HOME-PAGE' },
    { path: '^/app/admin/administrators$', title: 'NAVBAR.ADMINS-USERS' },
    { path: '^/app/admin/healthprofessionals$', title: 'NAVBAR.HEALTH-PRO-USERS' },
    { path: '^/app/pilotstudies$', title: 'SHARED.PILOTSTUDIES' },
    { path: '^/app/patients$', title: 'SHARED.PATIENTS' },
    { path: '^(\\/app/patients\\/)[a-fA-F0-9]{24}$', title: 'SHARED.PATIENTS' },
    { path: '^(\\/app/patients\\/)[a-fA-F0-9]{24}\\/[a-fA-F0-9]{24}\\/details$', title: 'NAVBAR.DETAILS-PATIENT' },
    { path: '^/app/healthprofessional/mystudies$', title: 'SHARED.MY-STUDIES' },
    { path: '^(\\/app/pilotstudies\\/)[a-fA-F0-9]{24}\\/details$', title: 'NAVBAR.DETAILS-STUDY' },
    { path: '^/app/admin/configurations$', title: 'SHARED.CONFIG' },
    { path: '^/app/healthprofessional/configurations$', title: 'SHARED.CONFIG' },
    { path: '^/app/healthprofessional/myevaluations$', title: 'SHARED.MY-EVALUATIONS' },
    { path: '^(\\/app/evaluations\\/)[a-fA-F0-9]{24}\\/nutritional', title: 'NAVBAR.NUTRITION-EVALUATIONS' }
];

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
    listTitles: RouteInfo[];
    location: Location;
    mobile_menu_visible: any = 0;
    toggleButton: any;
    sidebarVisible: boolean;
    userLogged: any;
    title: string;
    listPilots: Array<PilotStudy>;
    userId: string;
    pilotStudyId: string;
    pilotStudyName: string;
    flag = true;
    private subscriptions: Array<ISubscription>;
    userName: string;


    constructor(
        location: Location,
        private element: ElementRef,
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private pilotStudyService: PilotStudyService,
        private selectPilotService: SelectPilotStudyService,
        private localStorageService: LocalStorageService,
        private loadingService: LoadingService,
        private translateService: TranslateService) {
        this.location = location;
        this.sidebarVisible = false;
        this.subscriptions = new Array<ISubscription>();
        this.listPilots = new Array<PilotStudy>();
        this.userName = '';
    }

    ngOnInit() {
        this.subscriptions.push(this.router.events.subscribe((event) => {
            this.sidebarClose();
            const $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
            this.getTitle();
        }));
        this.pilotStudyId = this.localStorageService.getItem('pilotstudy_id');
        this.listTitles = ROUTES;
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.getUserName();
        this.getTitle();
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        this.sidebarVisible = true;
    };

    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };

    sidebarToggle() {
        const $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];
        let $layer = document.createElement('div');
        if (this.mobile_menu_visible === 1) {
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { // asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        const path_current = this.location.path();
        this.listTitles.forEach(element => {
            if (RegExp(element.path).test(path_current)) {
                this.title = element.title;
            }
        });
        this.verifyVisibilityOfSeletorOfPilotStudy();
    }


    verifyVisibilityOfSeletorOfPilotStudy(): void {
        switch (this.title) {
            case 'SHARED.PATIENTS':
                this.flag = true;
                break;
            case 'SHARED.HOME-PAGE':
                this.flag = true;
                break;
            default:
                this.flag = false;
                break;
        }
        if (this.getTypeUser() === 'patient') {
            this.flag = false;
        }
    }

    getUserName() {
        const localUserLogged = JSON.parse(this.localStorageService.getItem('userLogged'));
        const language = this.localStorageService.getItem('language');
        try {
            this.userLogged = localUserLogged;
            this.userName = this.userLogged.name ? this.userLogged.name : this.userLogged.email;
            this.configLanguage(language);
        } catch (e) {
            this.userService.getUserById(this.localStorageService.getItem('user'))
                .then(user => {
                    if (user) {
                        this.userLogged = user;
                        this.userName = this.userLogged.name ? this.userLogged.name : this.userLogged.email;
                        const health_area = user.health_area ? user.health_area : 'admin';
                        this.localStorageService.setItem('userLogged', JSON.stringify(user));
                        this.localStorageService.setItem('email', user.email);
                        this.localStorageService.setItem('health_area', health_area);
                        this.localStorageService.setItem('language', user.language);
                        this.configLanguage(user.language);
                    }
                })
                .catch(() => {

                });
        }

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

    configLanguage(language: string) {
        const regexLanguages = this.translateService.getLangs().join('|');
        if (language) {
            this.translateService.use(language.match(regexLanguages) ? language : this.translateService.defaultLang);
        } else {
            const browserLang = this.translateService.getBrowserLang();
            this.translateService.use(browserLang.match(regexLanguages) ? browserLang : this.translateService.defaultLang);
        }
    }

    trackById(index, item) {
        return item.id;
    }

    logout() {
        this.loadingService.open();
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
