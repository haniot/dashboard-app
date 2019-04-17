import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { IMeasurement, Measurement, MeasurementType } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';

@Component({
  selector: 'measurement-component',
  templateUrl: './measurement-component.component.html',
  styleUrls: ['./measurement-component.component.scss']
})
export class MeasurementComponentComponent implements OnInit, OnChanges {

  listWeight: Array<IMeasurement>;
  listHeight: Array<IMeasurement>;
  listWaistCircunference: Array<IMeasurement>;
  listBodyTemperature: Array<IMeasurement>;
  listBloodGlucose: Array<IMeasurement>;
  
  @Input() patientId;

  constructor(
    private measurementService: MeasurementService
  ) { }

  ngOnInit() {
    this.loadMeasurements();
  }

  loadMeasurements() {
    this.measurementService.getAllByUser(this.patientId)
      .then((measurements: Array<IMeasurement>) => {
        this.listWeight = measurements.filter((element: Measurement) => {
          return element.type === MeasurementType.weight
        });

        this.listHeight = measurements.filter((element: Measurement) => {
          return element.type === MeasurementType.height
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

      })
      .catch();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.patientId && changes.patientId.currentValue != changes.patientId.previousValue) {
      this.loadMeasurements();
    }
  }

}
