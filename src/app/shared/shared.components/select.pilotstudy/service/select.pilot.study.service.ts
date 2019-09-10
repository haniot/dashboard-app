import { EventEmitter, Injectable } from '@angular/core';

import { UserService } from '../../../../modules/admin/services/users.service'
import { LocalStorageService } from '../../../shared.services/local.storage.service'

declare var $: any;

@Injectable()
export class SelectPilotStudyService {

    pilotStudyUpdated = new EventEmitter();

    constructor(
        private userService: UserService,
        private localStorageService: LocalStorageService) {

    }

    open() {
        $('#selectPilotStudy').modal('show');
    }

    close() {
        $('#selectPilotStudy').modal('hide');
    }

    pilotStudyHasUpdated(pilotId: string) {
        const userId = this.localStorageService.getItem('user');
        this.localStorageService.setItem(userId, pilotId);
        const userLogged = JSON.parse(this.localStorageService.getItem('userLogged'));
        userLogged.selected_pilot_study = pilotId;
        this.localStorageService.setItem('userLogged', JSON.stringify(userLogged));
        this.userService.changePilotStudySelected(userId, pilotId)
            .then(() => this.pilotStudyUpdated.emit())
            .catch(() => {
            })
    }

}
