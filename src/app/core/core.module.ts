import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { TemplateModule } from './template/template.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //AppRoutingModule
    TemplateModule
  ],
  exports: [
    TemplateModule
  ]
})
export class CoreModule { }
