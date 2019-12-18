import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { EnumMeasurementType, Measurement, SearchForPeriod } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';
import { BloodPressure } from '../models/blood.pressure';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { Weight } from '../models/weight';
import { BloodGlucose } from '../models/blood.glucose';
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service'
import { PilotStudy } from '../../pilot.study/models/pilot.study'
import { TimeSeries, TimeSeriesType } from '../../activity/models/time.series'
import { Sleep, SleepPattern, SleepPatternSummaryData } from '../../activity/models/sleep'

class ConfigVisibility {
    weight: boolean;
    height: boolean;
    fat: boolean;
    circumference: boolean;
    temperature: boolean;
    glucose: boolean;
    pressure: boolean;
    heartRate: boolean;
    sleep: boolean;

    constructor() {
        this.weight = true;
        this.height = false;
        this.fat = false;
        this.circumference = false;
        this.temperature = false;
        this.glucose = false;
        this.pressure = false;
        this.heartRate = false;
        this.sleep = false;
    }
};

@Component({
    selector: 'measurement-component',
    templateUrl: './measurement.component.html',
    styleUrls: ['./measurement.component.scss']
})
export class MeasurementComponent implements OnChanges {
    @Input() configVisibility: ConfigVisibility;
    @Input() patientId;
    listWeight: Array<Weight>;
    listHeight: Array<Measurement>;
    listFat: Array<Measurement>;
    listWaistCircumference: Array<Measurement>;
    listBodyTemperature: Array<Measurement>;
    listBloodGlucose: Array<BloodGlucose>;
    listBloodPressure: Array<BloodPressure>;
    listHeartRate: Array<TimeSeries>;
    listSleep: Array<Sleep>;
    filter: SearchForPeriod;
    studySelected: PilotStudy;
    graphOrdem: Array<string>;
    measurementsLenght = Object.keys(EnumMeasurementType).length

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
        this.listHeartRate = new Array<TimeSeries>();
        this.listSleep = new Array<Sleep>();
        this.configVisibility = new ConfigVisibility();
        this.filter = { start_at: null, end_at: new Date().toISOString().split('T')[0], period: 'today' };
        this.studySelected = new PilotStudy();
        this.graphOrdem = new Array<string>();
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
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.WEIGHT, null, null, this.filter)
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
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.HEIGHT, null, null, this.filter)
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
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.BODY_FAT, null, null, this.filter)
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
                    .getAllByUserAndType(this.patientId, EnumMeasurementType.WAIST_CIRCUMFERENCE, null, null, this.filter)
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
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.BODY_TEMPERATURE, null, null, this.filter)
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
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.BLOOD_GLUCOSE, null, null, this.filter)
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
                this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.BLOOD_PRESSURE, null, null, this.filter)
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

    loadHeartRate() {
        if (this.configVisibility.heartRate) {
            this.graphOrdem.push('heartRate');
            if (!this.listHeartRate.length) {
                this.measurementService.getAllByUserAndType(this.patientId, TimeSeriesType.heart_rate, null, null, this.filter)
                    .then(httpResponse => {
                        this.listHeartRate = httpResponse.body;
                    })
                    .catch();
            }
        } else {
            this.graphOrdem = this.graphOrdem.filter(item => item !== 'heartRate')
        }
    }

    loadSleep() {
        if (this.configVisibility.sleep) {
            this.graphOrdem.push('sleep');
            /* Mocks*/

            const sleep = new Sleep()
            sleep.start_time = '2018-08-18T01:40:30.00Z';
            sleep.end_time = '2018-08-18T09:36:30.00Z';
            sleep.duration = 29520000;
            sleep.pattern = new SleepPattern()
            sleep.pattern.data_set = [
                {
                    start_time: '2018-08-18T01:40:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:41:30.00Z',
                    name: 'asleep',
                    duration: 360000
                },
                {
                    start_time: '2018-08-18T01:47:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T01:51:30.00Z',
                    name: 'asleep',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:52:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:53:30.00Z',
                    name: 'asleep',
                    duration: 2100000
                },
                {
                    start_time: '2018-08-18T02:28:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T02:32:30.00Z',
                    name: 'awake',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T02:35:30.00Z',
                    name: 'asleep',
                    duration: 15120000
                },
                {
                    start_time: '2018-08-18T06:47:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T06:48:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T07:31:30.00Z',
                    name: 'restless',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:33:30.00Z',
                    name: 'asleep',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:35:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:36:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T07:56:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:57:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T08:40:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T08:43:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T09:04:30.00Z',
                    name: 'asleep',
                    duration: 1740000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T09:36:30.00Z',
                    name: 'asleep',
                    duration: 960000
                }
            ];

            sleep.pattern.summary.asleep = new SleepPatternSummaryData()
            sleep.pattern.summary.asleep.count = 55;
            sleep.pattern.summary.asleep.duration = 28020000;

            sleep.pattern.summary.awake = new SleepPatternSummaryData()
            sleep.pattern.summary.awake.count = 5;
            sleep.pattern.summary.awake.duration = 28020000;

            sleep.pattern.summary.restless = new SleepPatternSummaryData()
            sleep.pattern.summary.restless.count = 40;
            sleep.pattern.summary.restless.duration = 28020000;

            const sleep3 = new Sleep()
            sleep3.start_time = '2018-08-18T01:40:30.00Z';
            sleep3.end_time = '2018-08-18T09:36:30.00Z';
            sleep3.duration = 34420000;
            sleep3.pattern = new SleepPattern()
            sleep3.pattern.data_set = [
                {
                    start_time: '2018-08-18T01:40:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:41:30.00Z',
                    name: 'asleep',
                    duration: 360000
                },
                {
                    start_time: '2018-08-18T01:47:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T01:51:30.00Z',
                    name: 'asleep',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:52:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:53:30.00Z',
                    name: 'asleep',
                    duration: 2100000
                },
                {
                    start_time: '2018-08-18T02:28:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T02:32:30.00Z',
                    name: 'awake',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T02:35:30.00Z',
                    name: 'asleep',
                    duration: 15120000
                },
                {
                    start_time: '2018-08-18T06:47:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T06:48:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T07:31:30.00Z',
                    name: 'restless',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:33:30.00Z',
                    name: 'asleep',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:35:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:36:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T07:56:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:57:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T08:40:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T08:43:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T09:04:30.00Z',
                    name: 'asleep',
                    duration: 1740000
                },
                {
                    start_time: '2018-08-18T09:03:30.00Z',
                    name: 'restless',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T09:36:30.00Z',
                    name: 'asleep',
                    duration: 960000
                }
            ];

            sleep3.pattern.summary.asleep = new SleepPatternSummaryData()
            sleep3.pattern.summary.asleep.count = 63;
            sleep3.pattern.summary.asleep.duration = 28020000;

            sleep3.pattern.summary.awake = new SleepPatternSummaryData()
            sleep3.pattern.summary.awake.count = 7;
            sleep3.pattern.summary.awake.duration = 28020000;

            sleep3.pattern.summary.restless = new SleepPatternSummaryData()
            sleep3.pattern.summary.restless.count = 30;
            sleep3.pattern.summary.restless.duration = 28020000;

            const sleep2 = new Sleep()
            sleep2.start_time = '2018-08-18T01:40:30.00Z';
            sleep2.end_time = '2018-08-18T09:36:30.00Z';
            sleep2.duration = 39720000;
            sleep2.pattern = new SleepPattern()
            sleep2.pattern.data_set = [
                {
                    start_time: '2018-08-18T01:40:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:41:30.00Z',
                    name: 'asleep',
                    duration: 360000
                },
                {
                    start_time: '2018-08-18T01:47:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T01:51:30.00Z',
                    name: 'asleep',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:52:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T01:53:30.00Z',
                    name: 'asleep',
                    duration: 2100000
                },
                {
                    start_time: '2018-08-18T02:28:30.00Z',
                    name: 'restless',
                    duration: 240000
                },
                {
                    start_time: '2018-08-18T02:32:30.00Z',
                    name: 'awake',
                    duration: 180000
                },
                {
                    start_time: '2018-08-18T02:35:30.00Z',
                    name: 'asleep',
                    duration: 15120000
                },
                {
                    start_time: '2018-08-18T06:47:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T06:48:30.00Z',
                    name: 'asleep',
                    duration: 2580000
                },
                {
                    start_time: '2018-08-18T07:31:30.00Z',
                    name: 'restless',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:33:30.00Z',
                    name: 'asleep',
                    duration: 120000
                },
                {
                    start_time: '2018-08-18T07:35:30.00Z',
                    name: 'restless',
                    duration: 60000
                },
                {
                    start_time: '2018-08-18T07:36:30.00Z',
                    name: 'asleep',
                    duration: 1200000
                },
                {
                    start_time: '2018-08-18T07:56:30.00Z',
                    name: 'restless',
                    duration: 60000
                }
            ];

            sleep2.pattern.summary.asleep = new SleepPatternSummaryData()
            sleep2.pattern.summary.asleep.count = 45;
            sleep2.pattern.summary.asleep.duration = 28020000;

            sleep2.pattern.summary.awake = new SleepPatternSummaryData()
            sleep2.pattern.summary.awake.count = 5;
            sleep2.pattern.summary.awake.duration = 28020000;

            sleep2.pattern.summary.restless = new SleepPatternSummaryData()
            sleep2.pattern.summary.restless.count = 50;
            sleep2.pattern.summary.restless.duration = 28020000;

            return this.listSleep = [sleep, sleep2, sleep3];

            if (!this.listSleep.length) {
                // this.measurementService.getAllByUserAndType(this.patientId, 'sleep', null, null, this.filter)
                //     .then(httpResponse => {
                //         this.listSleep = httpResponse.body;
                //     })
                //     .catch();
            }
        } else {
            this.graphOrdem = this.graphOrdem.filter(item => item !== 'sleep')
        }
    }

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
