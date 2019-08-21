import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable()
export class AccessDeniedInterceptor implements HttpInterceptor {

    constructor(private injector: Injector, private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).catch((errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 403) {
                // this.router.navigate(['/access-denied']);
            }
            return Observable.throw(errorResponse);
        });

    }
}
