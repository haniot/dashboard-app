import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../admin/services/users.service';
import { LocalStorageService } from '../../../shared/shared-services/localstorage.service';
import { LanguagesConfiguration } from '../../../../assets/i18n/config.js';

const languagesConfig = LanguagesConfiguration;

@Component({
    selector: 'language-settings',
    templateUrl: './language-settings.component.html',
    styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent implements OnInit {
    languages = languagesConfig;
    listOfLanguages: Array<String>;
    userId: string;

    constructor(
        private userService: UserService,
        private localStorageService: LocalStorageService,
        private toastService: ToastrService,
        private translate: TranslateService) {
        this.listOfLanguages = new Array<String>();
    }

    ngOnInit() {
        this.listOfLanguages = this.translate.getLangs();
    }

    loadUser(): void {
        this.userId = this.localStorageService.getItem('user');
    }

    changeLanguage(language: string): void {

        if (!this.userId) {
            this.loadUser();
        }

        this.userService.changeLanguage(this.userId, language)
            .then(() => {
                this.translate.use(language);
            })
            .catch(() => {
                this.toastService.error(this.translate.instant('TOAST-MESSAGES.NOT-CHANGE-LANGUAGE'));
            })
    }


}
