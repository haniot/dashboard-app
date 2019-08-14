import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Device } from '../models/device';
import { environment } from '../../../../environments/environment'

@Injectable()
export class DeviceService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    create(userId: string, device: Device): Promise<Device> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/patients/${userId}/devices`, device)
            .toPromise();
    }

    getAllByUser(userId: string): Promise<Array<Device>> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${userId}/devices`)
            .toPromise();
    }

    getById(userId: string, deviceId: string): Promise<Device> {
        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${userId}/devices/${deviceId}`)
            .toPromise();
    }

    remove(userId: string, deviceId: string): Promise<Device> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/patients/${userId}/devices/${deviceId}`)
            .toPromise();
    }

}
