import { Injectable } from '@angular/core';

@Injectable()
export class VerifyScopeService {

  constructor() { }

  verifyScopes(expectedScopes: Array<String>, scopes: Array<String>): boolean {
    if (expectedScopes.length === 0) {
      return true;
    }

    let result = true;

    expectedScopes.forEach(scope => {
      if (!scopes.find(user => {
        return user == scope;
      })) {
        result = false;
      }
    });

    return result;
  }

  // verifyScopes(expectedScopes: Array<String>, scopes: Array<String>): boolean {
  //   if (expectedScopes.length === 0) {
  //     return true;
  //   }

  //   var allowed = expectedScopes.some(function (scope) {
  //     return scopes.indexOf(scope) !== -1;
  //   });

  //   return allowed ?
  //     true :
  //     false;
  // }

}
