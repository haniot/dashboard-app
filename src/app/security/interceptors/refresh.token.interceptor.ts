import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    constructor(private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return <any>next.handle(request)
            .pipe(
                catchError((errorResponse: HttpErrorResponse) => {

                    const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse.error;

                    if (errorResponse.status === 401 && error.code === 401 && error.message === 'UNAUTHORIZED') {
                        this.router.navigate(['auth/login']);
                    }
                    return Observable.throw(errorResponse);
                })
            );

    }
}
