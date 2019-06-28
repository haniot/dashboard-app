import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from "../../admin/services/users.service";
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";
import {connectableObservableDescriptor} from "rxjs/internal/observable/ConnectableObservable";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'language-settings',
    templateUrl: './language-settings.component.html',
    styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent implements OnInit {

    languages = {
        'pt-BR': 'Português Brasileiro',
        'en-US': 'Inglês'
    };

    listOflanguages: Array<String>;

    userId: string;

    constructor(
        private userService: UserService,
        private localStorageService: LocalStorageService,
        private toastService: ToastrService,
        private translate: TranslateService) {
        this.listOflanguages = new Array<String>();
    }

    ngOnInit() {
        this.listOflanguages = this.translate.getLangs();
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
            .catch(errorResponse => {
                this.toastService.error('\'Não foi possível alterar idioma!\'');
                console.log('Não foi possível alterar idioma!', connectableObservableDescriptor);
            })
    }


}
