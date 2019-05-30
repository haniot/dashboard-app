import {Injectable, EventEmitter} from '@angular/core';

import {Error} from 'app/shared/shared-models/error'

declare var $: any;

@Injectable()
export class SelectPilotStudyService {

    constructor() {
    }

    open() {
        $('#selectPilotStudy').modal('show');
    }

    close() {
        $('#selectPilotStudy').modal('hide');
    }
}
