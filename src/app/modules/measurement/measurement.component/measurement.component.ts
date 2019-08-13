import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { EnumMeasurementType, Measurement } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';
import { BloodPressure } from '../models/blood-pressure';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { Weight } from '../models/weight';
import { BloodGlucose } from '../models/blood-glucose';

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
    listWeight: Array<Weight>;
    listHeight: Array<Measurement>;
    listFat: Array<Measurement>;
    listWaistCircumference: Array<Measurement>;
    listBodyTemperature: Array<Measurement>;
    listBloodGlucose: Array<BloodGlucose>;
    listBloodPressure: Array<BloodPressure>;
    // listHeartRate: Array<GenericMeasurement>;
    userHealthArea: string;
    filter: { start_at: string, end_at: string, period: string };

    constructor(
        private measurementService: MeasurementService,
        private localStorageService: LocalStorageService
    ) {
        this.listWeight = new Array<Weight>();
        this.listHeight = new Array<Measurement>();
        this.listFat = new Array<Measurement>();
        this.listWaistCircumference = new Array<Measurement>();
        this.listBodyTemperature = new Array<Measurement>();
        this.listBloodGlucose = new Array<BloodGlucose>();
        this.listBloodPressure = new Array<BloodPressure>();
        // this.listHeartRate = new Array<HeartRate>();
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
        // this.loadHeartRate()
    }

    loadWeight() {
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.weight, null, null, this.filter)
            .then((httpResponse) => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.listWeight = httpResponse.body;
                }
            })
            .catch();
    }

    loadHeight() {
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.height, null, null, this.filter)
            .then((httpResponse) => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.listHeight = httpResponse.body;
                }
            })
            .catch();
    }

    loadFat() {
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.body_fat, null, null, this.filter)
            .then(httpResponse => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.listFat = httpResponse.body;
                }
            })
            .catch();
    }

    loadWaistCircumference() {
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.waist_circumference, null, null, this.filter)
            .then(httpResponse => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.listWaistCircumference = httpResponse.body;
                }
            })
            .catch();
    }

    loadBodyTemperature() {
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.body_temperature, null, null, this.filter)
            .then(httpResponse => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.listBodyTemperature = httpResponse.body;
                }
            })
            .catch();
    }

    loadBloodGlucose() {
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.blood_glucose, null, null, this.filter)
            .then(httpResponse => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.listBloodGlucose = httpResponse.body;
                }
            })
            .catch();
    }

    loadBloodPressure() {
        this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.blood_pressure, null, null, this.filter)
            .then(httpResponse => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.listBloodPressure = httpResponse.body;
                }
            })
            .catch();
    }

    // loadHeartRate() {
    //     this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.heart_rate, null, null, this.filter)
    //         .then(httpResponse => {
    //             this.listHeartRate = httpResponse.body;
    //         })
    //         .catch();
    // }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.loadMeasurements();
        }
    }

}
