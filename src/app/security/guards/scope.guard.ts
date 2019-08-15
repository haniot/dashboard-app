import { Injectable } from '@angular/core';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/services/auth.service';
import { VerifyScopeService } from '../services/verify.scope.service';

@Injectable()
export class ScopeGuard implements CanActivate, CanActivateChild {

    constructor(
        private auth: AuthService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private verifyScopesService: VerifyScopeService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        const userScopes: Array<String> = this.auth.getScopeUser().split(' ');
        if (route.data && route.data.scope) {
            const expectedScopes = route.data.scope.split(' ');
            const permission = this.verifyScopes(expectedScopes, userScopes);
            if (!permission) {
                this.router.navigate(['/access-denied']);
            }
            return permission;
        } else {
            return true;
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }

    verifyScopes(expectedScopes: Array<String>, userScopes: Array<String>): boolean {
        return this.verifyScopesService.verifyScopes(expectedScopes, userScopes);
    }
}
