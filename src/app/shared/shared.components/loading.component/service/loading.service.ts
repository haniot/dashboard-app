import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    change = new EventEmitter();

    open() {
        this.change.emit(true)
    }

    close() {
        this.change.emit(false)
    }
}
