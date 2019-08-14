import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { AuthService } from '../../../security/auth/services/auth.service'
import { VerifyScopeService } from '../../../security/services/verify.scope.service'
import { UserService } from '../../../modules/admin/services/users.service'
import { LoadingService } from '../../../shared/shared.components/loading.component/service/loading.service'
import { Location } from '@angular/common'

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
        scopes: []
    }
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    userId: string;
    configSideBar: { title: string, scopes: any[] }[];
    userName: String = '';
    iconUserMenu = 'keyboard_arrow_right';
    activeMyPilots: string;
    activeMyEvaluations: string;
    activeDashboard: string;
    activePatients: string;

    constructor(
        private authService: AuthService,
        private verifyScopesService: VerifyScopeService,
        private userService: UserService,
        private loadingService: LoadingService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private activedRoute: ActivatedRoute,
        private location: Location
    ) {
    }

    ngOnInit() {
        this.configSideBar = configSideBar;
        this.getUserName();
        this.router.events.subscribe(event => this.updateMenu());
        this.activedRoute.paramMap.subscribe(() => this.updateMenu());
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
        const scopes = this.authService.getScopeUser();
        if (scopes) {
            const userScopes: Array<String> = scopes.split(' ');
            return this.verifyScopesService.verifyScopes(routerScopes, userScopes);
        }
        return false;
    }

    getUserName() {
        this.userId = this.localStorageService.getItem('user');
        const localUserLogged = JSON.parse(this.localStorageService.getItem('userLogged'));
        let username = '';
        try {
            username = localUserLogged.name ? localUserLogged.name : localUserLogged.email;
            this.userName = username;
        } catch (e) {
            this.userService.getUserById(this.userId)
                .then(user => {
                    if (user) {
                        this.userName = user.name ? user.name : user.email;
                        this.localStorageService.setItem('userLogged', JSON.stringify(user));
                    }
                })
                .catch();
        }
    }

    updateMenu() {

        const path_current = this.location.path();

        if (path_current.match('dashboard$')) {
            this.activeDashboard = 'active'
            this.activeMyPilots = '';
            this.activeMyEvaluations = '';
            this.activePatients = '';
        }
        if (path_current.match('mystudies$')) {
            this.activeDashboard = ''
            this.activeMyPilots = 'active';
            this.activeMyEvaluations = '';
            this.activePatients = '';
        }
        if (path_current.match('myevaluations$')) {
            this.activeDashboard = ''
            this.activeMyPilots = '';
            this.activeMyEvaluations = 'active';
            this.activePatients = '';
        }
        if (path_current.match('patients$')) {
            this.activeDashboard = ''
            this.activeMyPilots = '';
            this.activeMyEvaluations = '';
            this.activePatients = 'active';
        }
    }

    myPilotStudies(): void {
        this.openLoading();
        switch (this.getTypeUser()) {
            case 'health_professional':
                this.router.navigate(['/app/healthprofessional/mystudies']);
                break;
            case 'patient':
                this.router.navigate(['/app/patients/mystudies']);
                break;
        }
    }

    myEvaluations(): void {
        this.openLoading();
        switch (this.getTypeUser()) {
            case 'health_professional':
                this.router.navigate(['/app/healthprofessional/myevaluations']);
                break;
            case 'patient':
                this.router.navigate(['/app/patients/myevaluations']);
                break;
        }
    }

    logout() {
        this.authService.logout();
    }

    onclickMenuUser(): void {
        this.iconUserMenu = this.iconUserMenu === 'keyboard_arrow_down' ? 'keyboard_arrow_right' : 'keyboard_arrow_down';
    }

    openLoading() {
        this.loadingService.open();
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
