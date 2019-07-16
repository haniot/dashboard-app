import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {IMeasurement, MeasurementType} from '../models/measurement';
import {MeasurementService} from '../services/measurement.service';
import {BloodPressure} from '../models/blood-pressure';
import {HeartRate} from '../models/heart-rate';
import {ModalService} from 'app/shared/shared-components/haniot-modal/service/modal.service';
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";

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
    templateUrl: './measurement-component.component.html',
    styleUrls: ['./measurement-component.component.scss']
})
export class MeasurementComponentComponent implements OnInit, OnChanges {

    @Input() configVisibility: ConfigVisibility;

    @Input() patientId;

    listWeight: Array<IMeasurement>;

    listHeight: Array<IMeasurement>;

    listFat: Array<IMeasurement>;

    listWaistCircunference: Array<IMeasurement>;

    listBodyTemperature: Array<IMeasurement>;

    listBloodGlucose: Array<IMeasurement>;

    listBloodPressure: Array<IMeasurement>;

    listHeartRate: Array<IMeasurement>;

    userHealthArea: string;

    filter: { start_at: string, end_at: string, period: string };

    constructor(
        private measurementService: MeasurementService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService
    ) {
        this.listWeight = new Array<IMeasurement>();
        this.listHeight = new Array<IMeasurement>();
        this.listFat = new Array<IMeasurement>();
        this.listWaistCircunference = new Array<IMeasurement>();
        this.listBodyTemperature = new Array<IMeasurement>();
        this.listBloodGlucose = new Array<IMeasurement>();
        this.listBloodPressure = new Array<BloodPressure>();
        this.listHeartRate = new Array<HeartRate>();
        this.configVisibility = new ConfigVisibility();
        this.filter = {start_at: null, end_at: new Date().toISOString().split('T')[0], period: 'today'};
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
            .catch(errorResponse => {
                // this.toastService.error('Não foi possível buscar medições!');
                // console.log('Não foi possível buscar medições!', errorResponse);
            });
    }

    loadHeight() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.height, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listHeight = measurements;
            })
            .catch(errorResponse => {
                // this.toastService.error('Não foi possível buscar medições!');
                // console.log('Não foi possível buscar medições!', errorResponse);
            });
    }

    loadFat() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.fat, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listFat = measurements;
            })
            .catch(errorResponse => {
                // this.toastService.error('Não foi possível buscar medições!');
                // console.log('Não foi possível buscar medições!', errorResponse);
            });
    }

    loadWaistCircumference() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.waist_circumference, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listWaistCircunference = measurements;
            })
            .catch(errorResponse => {
                // this.toastService.error('Não foi possível buscar medições!');
                // console.log('Não foi possível buscar medições!', errorResponse);
            });
    }

    loadBodyTemperature() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.body_temperature, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listBodyTemperature = measurements;
            })
            .catch(errorResponse => {
                // this.toastService.error('Não foi possível buscar medições!');
                // console.log('Não foi possível buscar medições!', errorResponse);
            });
    }

    loadBloodGlucose() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.blood_glucose, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listBloodGlucose = measurements;
            })
            .catch(errorResponse => {
                // this.toastService.error('Não foi possível buscar medições!');
                // console.log('Não foi possível buscar medições!', errorResponse);
            });
    }

    loadBloodPressure() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.blood_pressure, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listBloodPressure = measurements;
            })
            .catch(errorResponse => {
                // this.toastService.error('Não foi possível buscar medições!');
                // console.log('Não foi possível buscar medições!', errorResponse);
            });
    }

    loadHeartRate() {
        this.measurementService.getAllByUserAndType(this.patientId, MeasurementType.heart_rate, null, null, this.filter)
            .then((measurements: Array<any>) => {
                this.listHeartRate = measurements;
            })
            .catch(errorResponse => {
                // this.toastService.error('Não foi possível buscar medições!');
                // console.log('Não foi possível buscar medições!', errorResponse);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.patientId && changes.patientId && changes.patientId.currentValue !== changes.patientId.previousValue) {
            this.loadMeasurements();
        }
    }

}
