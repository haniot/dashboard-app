import { Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service'

@Injectable()
export class VerifyScopeService {

    constructor(private authService: AuthService) {
    }

    verifyScopes(expectedScopes: Array<String>): boolean {
        const scopes = this.authService.getScopeUser();
        if (scopes) {
            const userScopes: Array<String> = scopes.split(' ');

            if (expectedScopes.length === 0) {
                return true;
            }

            let result = true;

            expectedScopes.forEach(scope => {
                if (!userScopes.find(user => {
                    return user === scope;
                })) {
                    result = false;
                }
            });

            return result;
        }
        return false;
    }


}
