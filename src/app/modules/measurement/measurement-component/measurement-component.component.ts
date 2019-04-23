import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { IMeasurement, Measurement, MeasurementType } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';
import { BloodPressure } from '../models/blood-pressure';
import { HeartRate } from '../models/heart-rate';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'measurement-component',
  templateUrl: './measurement-component.component.html',
  styleUrls: ['./measurement-component.component.scss']
})
export class MeasurementComponentComponent implements OnInit, OnChanges {

  listWeight: Array<IMeasurement>;
  visibilityWeight: boolean = true;

  listHeight: Array<IMeasurement>;
  visibilityHeight: boolean = true;

  listFat: Array<IMeasurement>;
  visibilityFat: boolean = true;

  listWaistCircunference: Array<IMeasurement>;
  visibilityWaist: boolean = true;

  listBodyTemperature: Array<IMeasurement>;
  visibilityBody: boolean = true;

  listBloodGlucose: Array<IMeasurement>;
  visibilityGlucose: boolean = true;

  listBloodPressure: Array<BloodPressure>;
  visibilityPressure: boolean = true;

  listHeartRate: Array<HeartRate>;
  visibilityHeart: boolean = true;

  @Input() patientId;

  constructor(
    private measurementService: MeasurementService,
    private modalService: ModalService,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    this.loadMeasurements();
  }

  loadMeasurements() {
    this.measurementService.getAllByUser(this.patientId)
      .then((measurements: Array<any>) => {
        this.listWeight = measurements.filter((element: Measurement) => {
          return element.type === MeasurementType.weight
        });

        this.listHeight = measurements.filter((element: Measurement) => {
          return element.type === MeasurementType.height
        });

        this.listFat = measurements.filter((element: Measurement) => {
          return element.type === MeasurementType.fat
        });

        this.listWaistCircunference = measurements.filter((element: Measurement) => {
          return element.type === MeasurementType.waist_circunference
        });

        this.listBodyTemperature = measurements.filter((element: Measurement) => {
          return element.type === MeasurementType.body_temperature
        });

        this.listBloodGlucose = measurements.filter((element: Measurement) => {
          return element.type === MeasurementType.blood_glucose
        });

        this.listBloodPressure = measurements.filter((element: Measurement) => {
          return element.type === MeasurementType.blood_pressure
        });

        this.listHeartRate = measurements.filter((element: Measurement) => {
          return element.type === MeasurementType.heart_rate
        });

      })
      .catch(errorResponse => {
        this.toastService.error('Não foi possível buscar medições!');
        //console.log('Não foi possível buscar medições!',errorResponse);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.patientId && changes.patientId.currentValue != changes.patientId.previousValue) {
      this.loadMeasurements();
    }
  }

  showModalConfigGraph() {
    this.modalService.open('modalConfigGraph');
  }

  hiddenModalConfigGraph() {
    this.modalService.close('modalConfigGraph');
  }

}
