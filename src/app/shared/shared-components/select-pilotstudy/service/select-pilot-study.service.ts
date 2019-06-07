import {EventEmitter, Injectable} from "@angular/core";

declare var $: any;

@Injectable()
export class SelectPilotStudyService {

    pilotStudyUpdated = new EventEmitter();


    open() {
        $('#selectPilotStudy').modal('show');
    }

    close() {
        $('#selectPilotStudy').modal('hide');
    }

    pilotStudyHasUpdated() {
        this.pilotStudyUpdated.emit();
    }

}
