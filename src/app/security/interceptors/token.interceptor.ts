import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { LocalStorageService } from '../../shared/shared.services/local.storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private localStorageService: LocalStorageService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.localStorageService.getItem('token');

        if (token) {
            const newRequest = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return next.handle(newRequest);
        } else {
            return next.handle(request);
        }

    }
}
