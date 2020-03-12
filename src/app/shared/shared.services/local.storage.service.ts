import { EventEmitter, Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js'
import { environment } from '../../../environments/environment'
import { Patient } from '../../modules/patient/models/patient'
import { PilotStudy } from '../../modules/pilot.study/models/pilot.study'


@Injectable()
export class LocalStorageService {
    patientSelected: EventEmitter<any>;
    pilotStudySelected: EventEmitter<any>;

    constructor() {
        this.patientSelected = new EventEmitter();
        this.pilotStudySelected = new EventEmitter();
    }

    selectedPatient(patient: Patient): void {
        this.setItem('patientSelected', JSON.stringify(patient));
        this.patientSelected.emit(patient);
    }

    selectedPilotStudy(pilotStudy: PilotStudy): void {
        const old: PilotStudy = JSON.parse(this.getItem('selectedPilotStudy'));
        this.setItem('selectedPilotStudy', JSON.stringify(pilotStudy));
        this.pilotStudySelected.emit(pilotStudy);
        if (old.id !== pilotStudy.id) {
            this.removeItem('patientSelected');
            this.patientSelected.emit();
        }
    }

    getItem(key: string): string {

        const encryptedKey = this.encryptKey(key);

        const encryptedItem = localStorage.getItem(encryptedKey.toString());

        if (encryptedItem) {
            return this.decryptItem(encryptedItem);
        } else {
            return null;
        }

    }

    setItem(key: string, item: string): void {

        const encryptedKey = this.encryptKey(key);

        const encryptedItem = this.encryptItem(item);

        localStorage.setItem(encryptedKey, encryptedItem);
    }

    removeItem(key: string): void {

        const encryptedKey = this.encryptKey(key);

        localStorage.removeItem(encryptedKey.toString());

    }

    logout(): void {
        localStorage.removeItem(this.encryptKey('token'));
        localStorage.removeItem(this.encryptKey('username'));
        localStorage.removeItem(this.encryptKey('userLogged'));
        localStorage.removeItem(this.encryptKey('user'));
        localStorage.removeItem(this.encryptKey('patientSelected'));
    }

    /** functions for encryt and decrypt key using base64 */
    encryptKey(str: string): string {
        return btoa(str);
    }

    decryptKey(encrypted: string): string {
        return atob(encrypted);
    }

    /** functions for encryt and decrypt item using CryptorJS AES */
    encryptItem(str: string): string {
        const encrypted = CryptoJS.AES.encrypt(str, environment.ls_secret_key);
        return encrypted.toString();
    }

    decryptItem(encrypted: string): string {
        const decrypted = CryptoJS.AES.decrypt(encrypted, environment.ls_secret_key);
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}
