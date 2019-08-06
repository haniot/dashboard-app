import { Injectable } from '@angular/core';

declare var $: any;

@Injectable()
export class LoadingService {

    constructor() { }

    open() {
        $('#modalLoading').modal('show');
    }

    close() {
        $('#modalLoading').modal('hide');
    }
}
