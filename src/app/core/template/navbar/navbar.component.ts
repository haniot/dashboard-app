import {Component, OnInit, ElementRef} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

import {AuthService} from 'app/security/auth/services/auth.service';
import {UserService} from 'app/modules/admin/services/users.service';
import {PilotStudy} from "../../../modules/pilot-study/models/pilot.study";
import {SelectPilotStudyService} from "../../../shared/shared-components/select-pilotstudy/service/select-pilot-study.service";
import {PilotStudyService} from "../../../modules/pilot-study/services/pilot-study.service";
import {connectableObservableDescriptor} from "rxjs/internal/observable/ConnectableObservable";

export declare interface RouteInfo {
    path: string;
    title: string;
}

export const ROUTES: RouteInfo[] = [
    {path: '^/dashboard$', title: 'Página Inicial'},
    {path: '^/ui/administrators$', title: 'Usuários - Administradores'},
    {path: '^/ui/healthprofessionals$', title: 'Usuários - Profissionais de Saúde'},
    {path: '^/pilotstudies$', title: 'Estudos Pilotos'},
    {path: '^/patients$', title: 'Pacientes'},
    {path: '^(\\/patients\\/)[a-fA-F0-9]{24}$', title: 'Pacientes'},
    {path: '^(\\/patients\\/)[a-fA-F0-9]{24}\\/[a-fA-F0-9]{24}\\/details$', title: 'Pacientes - Detalhes'},
    {path: '^/ui/mystudies$', title: 'Meus estudos'},
    {path: '^(\\/pilotstudies\\/)[a-fA-F0-9]{24}\\/details$', title: 'Estudo - Detalhes'},
    {path: '^/ui/myprofile$', title: 'Meus dados'},
    {path: '^/ui/myevaluations$', title: 'Minhas Avaliações'},
    {path: '^(\\/evaluations\\/)[a-fA-F0-9]{24}\\/nutritional', title: 'Avaliações - Nutricional'}
];

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
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

    /* Utilizado para deixar visivel e esconder o seletor de estudo piloto*/
    flag = true;


    constructor(
        location: Location,
        private element: ElementRef,
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private pilotStudyService: PilotStudyService,
        private selectPilotService: SelectPilotStudyService) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.pilotStudyId = localStorage.getItem('pilotstudy_id');
        this.selectPilotService.pilotStudyUpdated.subscribe(() => {
            this.loadPilotSelected();
        });
        this.getUserName();
        this.listTitles = ROUTES;
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
            this.getTitle();
        });
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

            $layer.onclick = function () { //asign a function
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
            case 'Pacientes':
                this.flag = true;
                break;
            case 'Página Inicial':
                this.flag = true;
                break;
            default:
                this.flag = false;
                break;
        }
    }

    getUserName() {
        const username = atob(localStorage.getItem('username'));
        if (localStorage.getItem('username')) {
            this.userName = username;
        } else {
            this.userService.getUserById(atob(localStorage.getItem('user')))
                .then(user => {
                    if (user) {
                        this.userName = user.name ? user.name : user.email;
                        localStorage.setItem('username', btoa(this.userName))
                    }
                })
                .catch(error => {
                    console.log(`| navbar.component.ts | Problemas na identificação do usuário. `, error);
                });
        }
    }

    loadUser(): void {
        this.userId = atob(localStorage.getItem('user'));
    }

    getAllPilotStudies() {
        if (!this.userId) {
            this.loadUser();
        }
        this.pilotStudyService.getAllByUserId(this.userId)
            .then(studies => {
                this.listPilots = studies;
            })
            .catch(error => {
                console.log('Erro ao buscar pilot-studies: ', error);
            });
    }

    isNotAdmin(): boolean {
        return this.authService.decodeToken().sub_type !== 'admin';
    }

    selectPilotStudy(): void {
        if (!this.userId) {
            this.loadUser()
        }
        localStorage.setItem(this.userId, this.pilotStudyId);
        this.selectPilotService.pilotStudyHasUpdated();
    }

    loadPilotSelected(): void {
        if (!this.userId) {
            this.loadUser();
        }
        const pilotselected = localStorage.getItem(this.userId);
        if (pilotselected) {
            this.pilotStudyId = pilotselected;
        } else if (this.authService.decodeToken().sub_type !== 'admin') {
            this.selectPilotService.open();
        }
    }

    logout() {
        this.authService.logout();
    }
}
