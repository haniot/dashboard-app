import {Component, OnInit} from '@angular/core';
import {UserService} from 'app/modules/admin/services/users.service';
import {AuthService} from 'app/security/auth/services/auth.service';
import {VerifyScopeService} from 'app/security/services/verify-scope.service';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";

declare const $: any;

export const configSideBar = [
    {title: 'Dashboard', scopes: []},
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
    /* Configurações de cada menu e submenu do sidebar*/
    // private menuItems: any[];

    userId: string;

    configSideBar: { title: string, scopes: any[] }[];

    userName: String = "";

    iconUserMenu = 'keyboard_arrow_right';

    iconEvaluatioinMenu = 'keyboard_arrow_right';

    constructor(
        private authService: AuthService,
        private verifyScopesService: VerifyScopeService,
        private userService: UserService,
        private loadingService: LoadingService,
        private locaStorageService: LocalStorageService
    ) {
    }

    ngOnInit() {
        // this.menuItems = ROUTES.filter(menuItem => menuItem);
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
        this.userId = this.locaStorageService.getItem('user');
        const username = this.locaStorageService.getItem('username');
        if (username) {
            this.userName = username;
        } else {
            this.userService.getUserById(this.userId)
                .then(user => {
                    if (user && user.name) {
                        this.userName = user.name;
                        this.locaStorageService.setItem('username', this.userName.toString());
                    }
                })
                .catch(error => {
                    // console.log(`| navbar.component.ts | Problemas na identificação do usuário. `, error);
                });
        }
    }

    logout() {
        this.authService.logout();
    }

    onclickMenuUser(): void {
        this.iconUserMenu = this.iconUserMenu === 'keyboard_arrow_down' ? 'keyboard_arrow_right' : 'keyboard_arrow_down';
    }

    onClickMenuEvaluation(): void {
        this.iconEvaluatioinMenu = this.iconUserMenu === 'keyboard_arrow_down' ? 'keyboard_arrow_right' : 'keyboard_arrow_down';
    }

    showMyStudies(): boolean {
        return this.authService.decodeToken().sub_type == 'health_professional';
    }

    openLoading() {
        this.loadingService.open();
    }
}
