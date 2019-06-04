import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() {
    }

    getItem(key: string): string {
        const item = localStorage.getItem(btoa(key));

        if (item) {
            return atob(item);
        }

        return null;

    }

    setItem(key: string, item: string): void {
        localStorage.setItem(btoa(key), btoa(item));
    }
}
