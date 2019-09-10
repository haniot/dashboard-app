import { Component, ComponentFactoryResolver, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { EnumMeasurementType, Measurement, SearchForPeriod } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';
import { BloodPressure } from '../models/blood-pressure';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { Weight } from '../models/weight';
import { BloodGlucose } from '../models/blood-glucose';
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service'
import { PilotStudy } from '../../pilot.study/models/pilot.study'

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
        this.weight = true;
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
    filter: SearchForPeriod;
    studySelected: PilotStudy;
    graphOrdem: Array<string>;

    constructor(
        private studyService: PilotStudyService,
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
        this.studySelected = new PilotStudy();
        this.graphOrdem = new Array<string>();
    }

    ngOnInit() {
        this.loadUserHealthArea();
    }

    loadUserHealthArea(): void {
        this.userHealthArea = this.localStorageService.getItem('health_area');
    }

    loadPilotSelected(): Promise<any> {
        const userId = this.localStorageService.getItem('user');
        const pilotId = this.localStorageService.getItem(userId);
        return this.studyService.getById(pilotId);
    }

    loadWeight() {
        if (this.configVisibility.weight) {
            this.graphOrdem.push('weight');
            if (!this.listWeight.length) {
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.weight, null, null, this.filter)
                    .then((httpResponse) => {
                        if (httpResponse.body && httpResponse.body.length) {
                            this.listWeight = httpResponse.body;
                        }
                    })
                    .catch(() => {
                    });
            }
        } else {
            this.graphOrdem = this.graphOrdem.filter(item => item !== 'weight')
        }
    }

    loadHeight() {
        if (this.configVisibility.height) {
            this.graphOrdem.push('height');
            if (!this.listHeight.length) {
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.height, null, null, this.filter)
                    .then((httpResponse) => {
                        if (httpResponse.body && httpResponse.body.length) {
                            this.listHeight = httpResponse.body;
                        }
                    })
                    .catch(() => {
                    });
            }
        } else {
            this.graphOrdem = this.graphOrdem.filter(item => item !== 'height')
        }
    }

    loadFat() {
        if (this.configVisibility.fat) {
            this.graphOrdem.push('fat');
            if (!this.listFat.length) {
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.body_fat, null, null, this.filter)
                    .then(httpResponse => {
                        if (httpResponse.body && httpResponse.body.length) {
                            this.listFat = httpResponse.body;
                        }
                    })
                    .catch(() => {
                    });
            }
        } else {
            this.graphOrdem = this.graphOrdem.filter(item => item !== 'fat')
        }
    }

    loadWaistCircumference() {
        if (this.configVisibility.circumference) {
            this.graphOrdem.push('circumference');
            if (!this.listWaistCircumference.length) {
                this.measurementService
                    .getAllByUserAndType(this.patientId, EnumMeasurementType.waist_circumference, null, null, this.filter)
                    .then(httpResponse => {
                        if (httpResponse.body && httpResponse.body.length) {
                            this.listWaistCircumference = httpResponse.body;
                        }
                    })
                    .catch(() => {
                    });
            }
        } else {
            this.graphOrdem = this.graphOrdem.filter(item => item !== 'circumference')
        }
    }

    loadBodyTemperature() {
        if (this.configVisibility.temperature) {
            this.graphOrdem.push('temperature');
            if (!this.listBodyTemperature.length) {
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.body_temperature, null, null, this.filter)
                    .then(httpResponse => {
                        if (httpResponse.body && httpResponse.body.length) {
                            this.listBodyTemperature = httpResponse.body;
                        }
                    })
                    .catch(() => {
                    });
            }
        } else {
            this.graphOrdem = this.graphOrdem.filter(item => item !== 'temperature')
        }
    }

    loadBloodGlucose() {
        if (this.configVisibility.glucose) {
            this.graphOrdem.push('glucose');
            if (!this.listBloodGlucose.length) {
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.blood_glucose, null, null, this.filter)
                    .then(httpResponse => {
                        if (httpResponse.body && httpResponse.body.length) {
                            this.listBloodGlucose = httpResponse.body;
                        }
                    })
                    .catch(() => {
                    });
            }
        } else {
            this.graphOrdem = this.graphOrdem.filter(item => item !== 'glucose')
        }
    }

    loadBloodPressure() {
        if (this.configVisibility.pressure) {
            this.graphOrdem.push('pressure');
            if (!this.listBloodPressure.length) {
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.blood_pressure, null, null, this.filter)
                    .then(httpResponse => {
                        if (httpResponse.body && httpResponse.body.length) {
                            this.listBloodPressure = httpResponse.body;
                        }
                    })
                    .catch(() => {
                    });
            }
        } else {
            this.graphOrdem = this.graphOrdem.filter(item => item !== 'pressure')
        }
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
            this.loadPilotSelected()
                .then(study => {
                    this.studySelected = study;
                    this.filter.start_at = this.studySelected.start.split('T')[0];
                    this.filter.end_at = this.studySelected.end.split('T')[0];
                    this.loadWeight();
                })
                .catch(() => {
                })

        }
    }

}
