import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

import {ISubscription} from "rxjs-compat/Subscription";
import {TranslateService} from '@ngx-translate/core';

import {AuthService} from 'app/security/auth/services/auth.service';
import {UserService} from 'app/modules/admin/services/users.service';
import {PilotStudy} from "../../../modules/pilot-study/models/pilot.study";
import {SelectPilotStudyService} from "../../../shared/shared-components/select-pilotstudy/service/select-pilot-study.service";
import {PilotStudyService} from "../../../modules/pilot-study/services/pilot-study.service";
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";
import {LoadingService} from "../../../shared/shared-components/loading-component/service/loading.service";


export declare interface RouteInfo {
    path: string;
    title: string;
}

export const ROUTES: RouteInfo[] = [
    {path: '^/dashboard$', title: 'SHARED.HOME-PAGE'},
    {path: '^/admin/new/administrators$', title: 'NAVBAR.ADMINS-USERS'},
    {path: '^/admin/new/healthprofessionals$', title: 'NAVBAR.HEALTH-PRO-USERS'},
    {path: '^/pilotstudies$', title: 'SHARED.PILOTSTUDIES'},
    {path: '^/patients$', title: 'SHARED.PATIENTS'},
    {path: '^(\\/patients\\/)[a-fA-F0-9]{24}$', title: 'SHARED.PATIENTS'},
    {path: '^(\\/patients\\/)[a-fA-F0-9]{24}\\/[a-fA-F0-9]{24}\\/details$', title: 'NAVBAR.DETAILS-PATIENT'},
    {path: '^/healthprofessional/mystudies$', title: 'SHARED.MY-STUDIES'},
    {path: '^(\\/pilotstudies\\/)[a-fA-F0-9]{24}\\/details$', title: 'NAVBAR.DETAILS-STUDY'},
    {path: '^/admin/configurations$', title: 'SHARED.CONFIG'},
    {path: '^/healthprofessional/configurations$', title: 'SHARED.CONFIG'},
    {path: '^/healthprofessional/myevaluations$', title: 'SHARED.MY-EVALUATIONS'},
    {path: '^(\\/evaluations\\/)[a-fA-F0-9]{24}\\/nutritional', title: 'NAVBAR.NUTRITION-EVALUATIONS'}
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

    userName = "";
    title: string;

    listPilots: Array<PilotStudy>;
    userId: string;

    pilotStudyId: string;
    pilotStudyName: string;

    /* Utilizado para deixar visivel e esconder o seletor de estudo piloto*/
    flag = true;

    private subscriptions: Array<ISubscription>;


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
    }

    ngOnInit() {
        /* subscriptions */
        this.subscriptions.push(this.selectPilotService.pilotStudyUpdated.subscribe(() => {
            this.loadPilotSelected();
            this.getNamePilotStudy();
        }));
        this.subscriptions.push(this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
            this.getTitle();
        }));

        this.pilotStudyId = this.localStorageService.getItem('pilotstudy_id');
        this.getUserName();
        this.listTitles = ROUTES;
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.loadPilotSelected();
        this.getTitle();

        this.getAllPilotStudies();


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
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
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

            var $layer = document.createElement('div');
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

        // path_current = '/' + path_current.split('/')[1];
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
    }

    getUserName() {
        const username = this.localStorageService.getItem('username');
        const language = this.localStorageService.getItem('language');

        if (username && language) {
            this.userName = username;
            this.configLanguage(language);
        } else {

            this.userService.getUserById(this.localStorageService.getItem('user'))
                .then(user => {
                    if (user) {
                        this.userName = user.name ? user.name : user.email;
                        const health_area = user.health_area ? user.health_area : 'admin';
                        this.localStorageService.setItem('username', this.userName);
                        this.localStorageService.setItem('email', user.email);
                        this.localStorageService.setItem('health_area', health_area);
                        this.localStorageService.setItem('language', user.language);
                        this.configLanguage(user.language);
                    }
                })
                .catch(error => {
                    // console.log(`| navbar.component.ts | Problemas na identificação do usuário. `, error);
                });
        }
    }

    loadUser(): void {
        this.userId = this.localStorageService.getItem('user');
    }

    getAllPilotStudies() {
        if (!this.userId) {
            this.loadUser();
        }
        this.pilotStudyService.getAllByUserId(this.userId)
            .then(studies => {
                this.listPilots = studies;
                this.getNamePilotStudy();
            })
            .catch(error => {
                // console.log('Erro ao buscar pilot-studies: ', error);
            });
    }

    isNotAdmin(): boolean {
        return this.authService.decodeToken().sub_type !== 'admin';
    }

    getNamePilotStudy(): void {
        this.listPilots.forEach(pilot => {
            if (pilot.id === this.pilotStudyId) {
                this.pilotStudyName = pilot.name;
            }
        })
    }

    selectPilotStudy(pilot_id: string): void {
        this.pilotStudyId = pilot_id;
        if (!this.userId) {
            this.loadUser()
        }
        this.localStorageService.setItem(this.userId, this.pilotStudyId);
        this.selectPilotService.pilotStudyHasUpdated();
    }

    loadPilotSelected(): void {
        if (!this.userId) {
            this.loadUser();
        }
        const pilotselected = this.localStorageService.getItem(this.userId);
        if (pilotselected) {
            this.pilotStudyId = pilotselected;
        } else if (this.authService.decodeToken().sub_type !== 'admin') {
            this.selectPilotService.open();
        }
    }

    config(): void {
        if (this.isNotAdmin()) {
            this.router.navigate(['/healthprofessional/configurations']);
        } else {
            this.router.navigate(['/admin/configurations']);
        }
    }

    configLanguage(language: string) {
        language = 'pt-BR';
        if (language) {
            this.translateService.use(language);
        } else {
            const browserLang = this.translateService.getBrowserLang();
            this.translateService.use(browserLang.match(/en-US|pt-BR/) ? browserLang : 'pt-BR');
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
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
