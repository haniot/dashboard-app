import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Device, IDevice, DeviceType } from '../models/device';

const mock: Array<IDevice> = [
    {
        "id": "5ca790f75d2f5766d993103a",
        "name": "YUNMAI SCALE",
        "address": "D4:36:39:91:75:71",
        "type": DeviceType.thermometer,
        "model_number": 5028,
        "manufacturer": "XIAOMI"
    },
    {
        "id": "5ca790f75d2f5766d993103a",
        "name": "YUNMAI SCALE",
        "address": "D4:36:39:91:75:71",
        "type": DeviceType.smartwatch,
        "model_number": 5028,
        "manufacturer": "XIAOMI"
    },
    {
        "id": "5ca790f75d2f5766d993103a",
        "name": "YUNMAI SCALE",
        "address": "D4:36:39:91:75:71",
        "type": DeviceType.blood_pressure,
        "model_number": 5028,
        "manufacturer": "XIAOMI"
    },
    {
        "id": "5ca790f75d2f5766d993103a",
        "name": "YUNMAI SCALE",
        "address": "D4:36:39:91:75:71",
        "type": DeviceType.body_composition,
        "model_number": 5028,
        "manufacturer": "XIAOMI"
    },{
        "id": "5ca790f75d2f5766d993103a",
        "name": "YUNMAI SCALE",
        "address": "D4:36:39:91:75:71",
        "type": DeviceType.glucometer,
        "model_number": 5028,
        "manufacturer": "XIAOMI"
    },{
        "id": "5ca790f75d2f5766d993103a",
        "name": "YUNMAI SCALE",
        "address": "D4:36:39:91:75:71",
        "type": DeviceType.heart_rate,
        "model_number": 5028,
        "manufacturer": "XIAOMI"
    },{
        "id": "5ca790f75d2f5766d993103a",
        "name": "YUNMAI SCALE",
        "address": "D4:36:39:91:75:71",
        "type": DeviceType.smartband,
        "model_number": 5028,
        "manufacturer": "XIAOMI"
    }
];

@Injectable()
export class DeviceService {

    constructor(private http: HttpClient) { }

    create(userId: string, device: Device): Promise<IDevice> {
        return this.http.post<any>(`${environment.api_url}/users/${userId}/devices`, device)
            .toPromise();
    }

    getAllByUser(userId: string): Promise<Array<IDevice>> {
        return Promise.resolve(mock);
        // return this.http.get<any>(`${environment.api_url}/users/${userId}/devices`)
        //     .toPromise();
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
