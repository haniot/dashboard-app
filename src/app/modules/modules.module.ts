import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material';
import { getConfigPaginator } from './config-matpaginator';
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getConfigPaginator() }
  ]
})
export class ModulesModule { }
