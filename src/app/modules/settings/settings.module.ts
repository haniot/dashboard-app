import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessSettingsComponent } from './access-settings/access-settings.component';
import { LanguageSettingsComponent } from './language-settings/language-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AccessSettingsComponent,
    LanguageSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule
  ],
  exports:[
    AccessSettingsComponent,
    LanguageSettingsComponent,
    TranslateModule
  ]
})
export class SettingsModule { }
