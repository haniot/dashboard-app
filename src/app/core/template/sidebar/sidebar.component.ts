import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'app/modules/admin/services/users.service';
import { AuthService } from 'app/security/auth/services/auth.service';
import { VerifyScopeService } from 'app/security/services/verify.scope.service';
import { LoadingService } from 'app/shared/shared.components/loading.component/service/loading.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';

declare const $: any;

export const configSideBar = [
    { title: 'Dashboard', scopes: [] },
    {
        title: 'Usuários',
        scopes: ['admins:create', 'admins:delete', 'admins:readAll', 'admins:update',
            'healthprofessionals:create', 'healthprofessionals:readAll', 'healthprofessionals:update', 'healthprofessionals:delete']
    },
    {
        title: 'Administradores',
        scopes: ['admins:create', 'admins:delete', 'admins:readAll', 'admins:update']
    },
    {
        title: 'P. de Saúde',
        scopes: ['healthprofessionals:create', 'healthprofessionals:delete', 'healthprofessionals:readAll', 'healthprofessionals:update']
    },
    {
        title: 'Estudos Pilotos',
        scopes: ['pilots:readAll', 'pilots:create', 'pilots:delete', 'pilots:update']
    },
    {
        title: 'Pacientes',
        scopes: ['patients:create', 'patients:read', 'patients:update', 'patients:delete']
    },
    {
        title: 'Meus estudos',
        scopes: []
    },
    {
        title: 'Minhas avaliações',
        scopes: []
    },
    {
        title: 'Avaliações',
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

    constructor(
        private authService: AuthService,
        private verifyScopesService: VerifyScopeService,
        private userService: UserService,
        private loadingService: LoadingService,
        private localStorageService: LocalStorageService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.configSideBar = configSideBar;
        this.getUserName();
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
        const username = this.localStorageService.getItem('username');
        if (username) {
            this.userName = username;
        } else {
            this.userService.getUserById(this.userId)
                .then(user => {
                    if (user && user.name) {
                        this.userName = user.name;
                        this.localStorageService.setItem('username', this.userName.toString());
                    }
                })
                .catch();
        }
    }

    logout() {
        this.authService.logout();
    }

    onclickMenuUser(): void {
        this.iconUserMenu = this.iconUserMenu === 'keyboard_arrow_down' ? 'keyboard_arrow_right' : 'keyboard_arrow_down';
    }

    showMyStudies(): boolean {
        return this.authService.decodeToken().sub_type === 'health_professional';
    }

    openLoading() {
        this.loadingService.open();
    }

    isNotAdmin(): boolean {
        return this.authService.decodeToken().sub_type !== 'admin';
    }

    config(): void {
        if (this.isNotAdmin()) {
            this.router.navigate(['/app/healthprofessional/configurations']);
        } else {
            this.router.navigate(['/app/admin/configurations']);
        }
    }
}
