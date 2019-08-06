import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TemplateComponent } from './template.component/template.component';
import { SharedModule } from '../../shared/shared.module';
import { AccessDeniedComponent } from './access.denied/access.denied.component';
import { NotfoundComponent } from './page.not.found/page.not.found.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatSelectModule,
        TranslateModule,
        SharedModule
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        NotfoundComponent,
        AccessDeniedComponent,
        TemplateComponent
    ],
    exports: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        TemplateComponent,
        AccessDeniedComponent,
        NotfoundComponent
    ]
})
export class TemplateModule {
}
