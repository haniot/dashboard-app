import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotfoundComponent } from './page-not-found/page-not-found.component';
import { AcessDeniedComponent } from './acess-denied/acess-denied.component';
import { TemplateComponent } from './template-component/template.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    NotfoundComponent,
    AcessDeniedComponent,
    TemplateComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TemplateComponent
  ]
})
export class TemplateModule { }
