import { EventEmitter, Injectable } from '@angular/core';

import { UserService } from '../../../../modules/admin/services/users.service'
import { LocalStorageService } from '../../../shared.services/local.storage.service'
import { PilotStudy } from '../../../../modules/pilot.study/models/pilot.study'
import { PilotStudyService } from '../../../../modules/pilot.study/services/pilot.study.service'

declare var $: any;

@Injectable()
export class SelectPilotStudyService {
    userId: string;
    pilotStudyUpdated: EventEmitter<any>;

    constructor(
        private userService: UserService,
        private studyService: PilotStudyService,
        private localStorageService: LocalStorageService) {
        this.pilotStudyUpdated = new EventEmitter();
    }

    open() {
        $('#selectPilotStudy').modal('show');
    }

    close() {
        $('#selectPilotStudy').modal('hide');
    }

    pilotStudyHasUpdated(pilotStudy: PilotStudy | string) {
        if (typeof pilotStudy === 'string') {
            this.getPilotSelected(pilotStudy);
        } else {
            this.userId = this.localStorageService.getItem('user');
            const oldPilotSelected = this.localStorageService.getItem(this.userId);
            this.localStorageService.setItem(this.userId, pilotStudy.id);
            const userLogged = JSON.parse(this.localStorageService.getItem('userLogged'));
            userLogged.selected_pilot_study = pilotStudy.id;
            this.localStorageService.setItem('userLogged', JSON.stringify(userLogged));
            if (pilotStudy.id !== oldPilotSelected) {
                this.userService
                    .changePilotStudySelected(this.userId, pilotStudy.id)
                    .then(() => this.pilotStudyUpdated.emit(pilotStudy))
                    .catch(() => {
                    })
            } else {
                this.pilotStudyUpdated.emit(pilotStudy)
            }
        }


    }

    getPilotSelected(pilotselected: string): void {
        this.userId = this.localStorageService.getItem('user');
        if (pilotselected) {
            this.studyService.getById(pilotselected)
                .then(study => {
                    this.pilotStudyHasUpdated(study);
                    this.localStorageService.selectedPilotStudy(study);
                })
                .catch((err) => {
                    console.error(err)
                });
        }

    }

}
