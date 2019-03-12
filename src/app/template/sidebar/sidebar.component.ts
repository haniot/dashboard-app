import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/auth/services/auth.service';
import { VerifyScopeService } from 'app/services/verify-scope.service';
import { UserService } from 'app/admin/services/users.service';

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
    title: 'Administrators',
    icon: 'supervisor_account',
    class: '',
    scopes: ['adminAccount:create', 'adminAccount:deleteAll', 'adminAccount:readAll', 'adminAccount:updateAll']
  },
  {
    path: '/caregiver',
    title: 'Caregiver',
    icon: 'accessibility',
    class: '',
    scopes: ['caregiverAccount:create', 'caregiverAccount:deleteAll', 'caregiverAccount:readAll', 'caregiverAccount:updateAll']
  }
];

const configSideBar = [
  { title: 'Dashboard', scopes: [] },
  {
    title: 'Usuários', scopes: ['adminAccount:create', 'adminAccount:deleteAll', 'adminAccount:readAll', 'adminAccount:updateAll',
      'caregiverAccount:create', 'caregiverAccount:deleteAll', 'caregiverAccount:readAll', 'caregiverAccount:updateAll']
  },
  { title: 'Administradores', scopes: ['adminAccount:create', 'adminAccount:deleteAll', 'adminAccount:readAll', 'adminAccount:updateAll'] },
  { title: 'Cuidadores', scopes: ['caregiverAccount:create', 'caregiverAccount:deleteAll', 'caregiverAccount:readAll', 'caregiverAccount:updateAll'] },
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

  myProfile() {

  }
}
