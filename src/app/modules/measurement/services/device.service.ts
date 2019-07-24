import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Device, IDevice } from '../models/device';

@Injectable()
export class DeviceService {

    constructor(private http: HttpClient) { }

    create(userId: string, device: Device): Promise<IDevice> {
        return this.http.post<any>(`${environment.api_url}/users/${userId}/devices`, device)
            .toPromise();
    }

    getAllByUser(userId: string): Promise<Array<IDevice>> {
        return this.http.get<any>(`${environment.api_url}/users/${userId}/devices`)
            .toPromise();
    }

    getById(userId: string, deviceId: string): Promise<IDevice> {
        return this.http.get<any>(`${environment.api_url}/users/${userId}/devices/${deviceId}`)
            .toPromise();
    }

    remove(userId: string, deviceId: string): Promise<IDevice> {
        return this.http.delete<any>(`${environment.api_url}/users/${userId}/devices/${deviceId}`)
            .toPromise();
    }

}
