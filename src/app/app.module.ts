import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AccordionModule } from 'primeng/accordion';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AdminModule } from './admin/admin.module';
import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { AplicationErrorHandle } from './app.error-handle';
import { AuthModule } from './auth/auth.module';
import { ChangePasswordInterceptor } from './interceptors/change-password.interceptor';
import { AppComponent } from './app.component';
import { ScopeGuard } from './guards/scope.guard';
import { VerifyScopeService } from './services/verify-scope.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AuthModule,
    AdminModule,
    AppRoutingModule,

    AccordionModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    AuthGuard,
    ScopeGuard,
    VerifyScopeService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: ChangePasswordInterceptor, multi: true },
    {provide: ErrorHandler, useClass: AplicationErrorHandle }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
