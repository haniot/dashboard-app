import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    getItem(key: string): string {

        const encryptedKey = this.encrypt(key);

        const encryptedItem = localStorage.getItem(encryptedKey.toString());

        if (encryptedItem) {
            return this.decrypt(encryptedItem);
        } else {
            return null;
        }

    }

    setItem(key: string, item: string): void {

        const encryptedKey = this.encrypt(key);

        const encryptedItem = this.encrypt(item);

        localStorage.setItem(encryptedKey, encryptedItem);
    }

    logout(): void {
        localStorage.removeItem(this.encrypt('token'));
        localStorage.removeItem(this.encrypt('username'));
        localStorage.removeItem(this.encrypt('user'));
        localStorage.removeItem(this.encrypt('health_area'));
    }

    encrypt(str: string): string {
        return btoa(str);
    }

    decrypt(encrypted: string): string {
        return atob(encrypted);
    }
}
