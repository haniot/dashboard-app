import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {IMeasurement, MeasurementType} from '../models/measurement';
import {MeasurementService} from '../services/measurement.service';
import {BloodPressure} from '../models/blood-pressure';
import {HeartRate} from '../models/heart-rate';
import {ModalService} from 'app/shared/shared-components/haniot-modal/service/modal.service';
import {ToastrService} from 'ngx-toastr';
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

    listWeight: Array<IMeasurement>;

    listHeight: Array<IMeasurement>;

    listFat: Array<IMeasurement>;

    listWaistCircunference: Array<IMeasurement>;

    listBodyTemperature: Array<IMeasurement>;

    listBloodGlucose: Array<IMeasurement>;

    listBloodPressure: Array<IMeasurement>;

    listHeartRate: Array<IMeasurement>;

    userHealthArea: string;

    @Input() patientId;

    constructor(
        private measurementService: MeasurementService,
        private modalService: ModalService,
        private toastService: ToastrService,
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
    }

    ngOnInit() {
        this.loaduserHealthArea();
        this.loadMeasurements();
    }

    loaduserHealthArea(): void {
        this.userHealthArea = this.localStorageService.getItem('health_area');
    }

    loadMeasurements() {
        this.measurementService.getAllByUser(this.patientId)
            .then((measurements: Array<any>) => {


                measurements.forEach((measurement: IMeasurement) => {

                    switch (measurement.type) {
                        case MeasurementType.weight:
                            this.listWeight.push(measurement);
                            break;

                        case MeasurementType.height:
                            this.listHeight.push(measurement);
                            break;

                        case MeasurementType.fat:
                            this.listFat.push(measurement);
                            break;

                        case MeasurementType.waist_circumference:
                            this.listWaistCircunference.push(measurement);
                            break;

                        case MeasurementType.body_temperature:
                            this.listBodyTemperature.push(measurement);
                            break;

                        case MeasurementType.blood_glucose:
                            this.listBloodGlucose.push(measurement);
                            break;

                        case MeasurementType.blood_pressure:
                            this.listBloodPressure.push(measurement);
                            break;

                        case MeasurementType.heart_rate:
                            this.listHeartRate.push(measurement);
                            break;
                    }

                })

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
