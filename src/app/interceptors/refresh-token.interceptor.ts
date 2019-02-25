import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { Router } from '../../../node_modules/@angular/router';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).catch((errorResponse: HttpErrorResponse) => {
      const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse.error;

      if (errorResponse.status === 401 && error.error === 'token_expired') {
        const http = this.injector.get(HttpClient);

        return http.post<any>(`${environment.api_url}/auth/refresh`, {})
          .flatMap(data => {
            localStorage.setItem('token', data.token);
            const cloneRequest = request.clone({setHeaders: {'Authorization': `Bearer ${data.token}`}});

            return next.handle(cloneRequest);
          });
      }

      if (errorResponse.status === 403) {
        const redirectlink: string = error.redirect_link;
        let temp = redirectlink.split('/');
        if(temp[temp.length-1] === 'password'){
          this.router.navigate(['auth/change'], { queryParams: { redirect_link: error.redirect_link } });
        }else{
          localStorage.clear();
          this.router.navigate(['auth/login']);
        }
      }

      return Observable.throw(errorResponse);
    });

  }
}
