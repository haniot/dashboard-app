import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { DeviceService } from '../services/device.service';
import { Device } from '../models/device';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'device',
    templateUrl: './device.component.html',
    styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnChanges {
    @Input() patientId
    listDevices: Array<Device> = [];

    constructor(
        private deviceService: DeviceService,
        private toastService: ToastrService,
        private translateService: TranslateService
    ) {
    }

    loadDevices() {
        if (this.patientId) {
            this.deviceService.getAllByUser(this.patientId)
                .then(devices => {
                    this.listDevices = devices;
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.NOT-FIND-DEVICES'));
                });
        }
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.loadDevices();
        }
    }

}
