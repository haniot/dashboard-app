import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable()
export class ChangePasswordInterceptor implements HttpInterceptor {

    constructor(private injector: Injector, private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).catch((errorResponse: HttpErrorResponse) => {
            const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse.error;

            if (errorResponse.status === 403) {
                const redirectlink: string = error.redirect_link;
                const temp: string[] = redirectlink.split('/');
                if (temp[temp.length - 1] === 'password') {
                    this.router.navigate(['/change'], { queryParams: { redirect_link: error.redirect_link } });
                } else {
                    this.router.navigate(['/access-denied']);
                }
            }

            return Observable.throw(errorResponse);
        });

    }
}
