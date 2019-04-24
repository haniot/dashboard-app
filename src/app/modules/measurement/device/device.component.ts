import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

import { DeviceService } from '../services/device.service';
import { IDevice } from '../models/device';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit, OnChanges {

  @Input() patientId

  listDevices: Array<IDevice> = [];

  constructor(
    private deviceService: DeviceService,
    private toastService: ToastrService
  ) { }

  ngOnInit() {

  }

  loadDevices() {
    if (this.patientId) {
      this.deviceService.getAllByUser(this.patientId)
        .then(devices => {
          this.listDevices = devices;
        })
        .catch(errorResponse => {
          this.toastService.error('Não foi possível buscar dispositivos!');
          //console.log('Não foi possível bsucar dispositivos!');
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.patientId && changes.patientId.currentValue != changes.patientId.previousValue) {
      this.loadDevices();
    }
  }

}
