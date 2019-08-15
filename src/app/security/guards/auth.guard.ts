import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from '../auth/services/auth.service';
import { LocalStorageService } from '../../shared/shared.services/local.storage.service'

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private auth: AuthService,
        private router: Router,
        private localStorageService: LocalStorageService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.auth.check()) {
            return true;
        }
        this.localStorageService.setItem('urlTemporary', state.url);
        this.router.navigate(['/login']);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.auth.check()) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
