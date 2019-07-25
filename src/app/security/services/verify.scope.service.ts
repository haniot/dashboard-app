import { Injectable } from '@angular/core';

@Injectable()
export class VerifyScopeService {

    constructor() {
    }

    verifyScopes(expectedScopes: Array<String>, scopes: Array<String>): boolean {
        if (expectedScopes.length === 0) {
            return true;
        }

        let result = true;

        expectedScopes.forEach(scope => {
            if (!scopes.find(user => {
                return user === scope;
            })) {
                result = false;
            }
        });

        return result;
    }


}
