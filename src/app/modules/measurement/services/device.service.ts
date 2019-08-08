import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Device } from '../models/device';

@Injectable()
export class DeviceService {

    constructor(private http: HttpClient) {
    }

    create(userId: string, device: Device): Promise<Device> {
        return this.http.post<any>(`${environment.api_url}/patients/${userId}/devices`, device)
            .toPromise();
    }

    getAllByUser(userId: string): Promise<Array<Device>> {
        return this.http.get<any>(`${environment.api_url}/patients/${userId}/devices`)
            .toPromise();
    }

    getById(userId: string, deviceId: string): Promise<Device> {
        return this.http.get<any>(`${environment.api_url}/patients/${userId}/devices/${deviceId}`)
            .toPromise();
    }

    remove(userId: string, deviceId: string): Promise<Device> {
        return this.http.delete<any>(`${environment.api_url}/patients/${userId}/devices/${deviceId}`)
            .toPromise();
    }

}
