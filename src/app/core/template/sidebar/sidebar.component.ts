import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/modules/admin/services/users.service';
import { AuthService } from 'app/security/auth/services/auth.service';
import { VerifyScopeService } from 'app/security/services/verify-scope.service';

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  scopes: Array<String>;
  children?: Array<any>;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '', scopes: [] },
  {
    path: '/usuarios',
    title: 'Usuários',
    icon: 'arrow_drop_down',
    class: '',
    scopes: ['adminAccount:create', 'adminAccount:deleteAll', 'adminAccount:readAll', 'adminAccount:updateAll',
      'caregiverAccount:create', 'caregiverAccount:deleteAll', 'caregiverAccount:readAll', 'caregiverAccount:updateAll']
  },
  {
    path: '/administrators',
    title: 'Administradores',
    icon: 'supervisor_account',
    class: '',
    scopes: ['adminAccount:create', 'adminAccount:deleteAll', 'adminAccount:readAll', 'adminAccount:updateAll']
  },
  {
    path: '/healthprofessionals',
    title: 'P. de Saúde',
    icon: 'accessibility',
    class: '',
    scopes: ['caregiverAccount:create', 'caregiverAccount:deleteAll', 'caregiverAccount:readAll', 'caregiverAccount:updateAll']
  }
];

const configSideBar = [
  { title: 'Dashboard', scopes: [] },
  {
    title: 'Usuários', scopes: ['admin:create', 'admin:deleteAll', 'admin:readAll', 'admin:updateAll',
      'healthprofessional:create', 'healthprofessional:deleteAll', 'healthprofessional:readAll', 'healthprofessional:updateAll']
  },
  { title: 'Administradores', scopes: ['admin:create', 'admin:deleteAll', 'admin:readAll', 'admin:updateAll'] },
  { title: 'P. de Saúde', scopes: ['healthprofessional:create', 'healthprofessional:deleteAll', 'healthprofessional:readAll' , 'healthprofessional:updateAll'] },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  /* Configurações de cada menu e submenu do sidebar*/
  //private menuItems: any[];

  private configSideBar: { title: string, scopes: any[] }[];

  private userName: String = "";

  private iconUserMenu: string = 'keyboard_arrow_right'

  constructor(
    private authService: AuthService,
    private verifyScopesService: VerifyScopeService,
    private userService: UserService) { }

  ngOnInit() {
    //this.menuItems = ROUTES.filter(menuItem => menuItem);
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
    const configRouter = this.configSideBar.filter((element)=>{
      return element.title === title;
    });
    const routerScopes = configRouter[0].scopes;
    const userScopes: Array<String> = this.authService.getScopeUser().split(' ');
    return this.verifyScopesService.verifyScopes(routerScopes, userScopes);
  }

  getUserName() {
    this.userService.getUserById(atob(localStorage.getItem('user')))
      .then(user => {
        if (user && user.name) {
          this.userName = user.name;
        }
      })
      .catch(error => {
        console.log(`| navbar.component.ts | Problemas na identificação do usuário. `, error);
      });
  }

  logout() {
    this.authService.logout();
  }

  onclickMenuUser(){
    this.iconUserMenu = this.iconUserMenu === 'keyboard_arrow_down'?'keyboard_arrow_right':'keyboard_arrow_down';
  }
}
