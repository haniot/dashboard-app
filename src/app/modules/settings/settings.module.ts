import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { AccessSettingsComponent } from './access.settings/access.settings.component';
import { LanguageSettingsComponent } from './language.settings/language.settings.component';
import { SharedModule } from '../../shared/shared.module';
import { DeleteAccountComponent } from './delete.account/delete.account.component';

@NgModule({
    declarations: [
        AccessSettingsComponent,
        LanguageSettingsComponent,
        DeleteAccountComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [
        AccessSettingsComponent,
        LanguageSettingsComponent,
        TranslateModule,
        DeleteAccountComponent
    ]
})
export class SettingsModule {
}
