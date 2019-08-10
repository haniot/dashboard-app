import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { GenericMeasurement, Measurement, MeasurementType } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';
import { BloodPressure } from '../models/blood-pressure';
import { HeartRate } from '../models/heart-rate';
import { ModalService } from 'app/shared/shared.components/haniot.modal/service/modal.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';

class ConfigVisibility {
    weight: boolean;
    height: boolean;
    fat: boolean;
    circumference: boolean;
    temperature: boolean;
    glucose: boolean;
    pressure: boolean;
    heartRate: boolean;

    constructor() {
        this.weight = false;
        this.height = false;
        this.fat = false;
        this.circumference = false;
        this.temperature = false;
        this.glucose = false;
        this.pressure = false;
        this.heartRate = false;
    }
};

@Component({
    selector: 'measurement-component',
    templateUrl: './measurement.component.html',
    styleUrls: ['./measurement.component.scss']
})
export class MeasurementComponent implements OnInit, OnChanges {
    @Input() configVisibility: ConfigVisibility;
    @Input() patientId;
    listWeight: Array<Measurement>;
    listHeight: Array<Measurement>;
    listFat: Array<Measurement>;
    listWaistCircumference: Array<Measurement>;
    listBodyTemperature: Array<Measurement>;
    listBloodGlucose: Array<Measurement>;
    listBloodPressure: Array<GenericMeasurement>;
    listHeartRate: Array<GenericMeasurement>;
    userHealthArea: string;
    filter: { start_at: string, end_at: string, period: string };

    constructor(
        private measurementService: MeasurementService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService
    ) {
        this.listWeight = new Array<Measurement>();
        this.listHeight = new Array<Measurement>();
        this.listFat = new Array<Measurement>();
        this.listWaistCircumference = new Array<Measurement>();
        this.listBodyTemperature = new Array<Measurement>();
        this.listBloodGlucose = new Array<Measurement>();
        this.listBloodPressure = new Array<BloodPressure>();
        this.listHeartRate = new Array<HeartRate>();
        this.configVisibility = new ConfigVisibility();
        this.filter = { start_at: null, end_at: new Date().toISOString().split('T')[0], period: 'today' };
    }

    ngOnInit() {
        this.loadUserHealthArea();
        this.loadMeasurements();
    }

    loadUserHealthArea(): void {
        this.userHealthArea = this.localStorageService.getItem('health_area');
    }

    loadMeasurements() {
        this.loadWeight();
        this.loadHeight();
        this.loadFat();
        this.loadWaistCircumference();
        this.loadBodyTemperature();
        this.loadBloodGlucose();
        this.loadBloodPressure();
        this.loadHeartRate()
    }

    loadWeight() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.weight, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listWeight = measurements;
            })
            .catch();
    }

    loadHeight() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.height, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listHeight = measurements;
            })
            .catch();
    }

    loadFat() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.body_fat, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listFat = measurements;
            })
            .catch();
    }

    loadWaistCircumference() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.waist_circumference, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listWaistCircumference = measurements;
            })
            .catch();
    }

    loadBodyTemperature() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.body_temperature, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listBodyTemperature = measurements;
            })
            .catch();
    }

    loadBloodGlucose() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.blood_glucose, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listBloodGlucose = measurements;
            })
            .catch();
    }

    loadBloodPressure() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.blood_pressure, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listBloodPressure = measurements;
            })
            .catch();
    }

    loadHeartRate() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.heart_rate, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listHeartRate = measurements;
            })
            .catch();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.loadMeasurements();
        }
    }

}
