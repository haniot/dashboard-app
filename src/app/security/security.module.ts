import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';

import { AuthGuard } from './guards/auth.guard';
import { ScopeGuard } from './guards/scope.guard';
import { AplicationErrorHandle } from 'app/app.error-handle';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { RefreshTokenInterceptor } from './interceptors/refresh.token.interceptor';
import { AccessDeniedInterceptor } from './interceptors/access.denied.interceptor';
import { VerifyScopeService } from './services/verify.scope.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        AuthGuard,
        ScopeGuard,
        VerifyScopeService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AccessDeniedInterceptor, multi: true },
        { provide: ErrorHandler, useClass: AplicationErrorHandle }
    ]
})
export class SecurityModule {
}
