import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { EnumMeasurementType, GenericMeasurement, Measurement, SearchForPeriod } from '../models/measurement';
import { MeasurementService } from '../services/measurement.service';
import { BloodPressure } from '../models/blood-pressure';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { Weight } from '../models/weight';
import { BloodGlucose } from '../models/blood-glucose';
import { PilotStudyService } from '../../pilot.study/services/pilot.study.service'
import { PilotStudy } from '../../pilot.study/models/pilot.study'
import { HeartRate } from '../models/heart-rate'
import { Pattern, Sleep, SleepStage } from '../models/sleep'

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
    listHeartRate: Array<GenericMeasurement>;
    listSleep: Array<Sleep>;
    userHealthArea: string;
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
        this.listHeartRate = new Array<HeartRate>();
        this.listSleep = new Array<Sleep>();
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

    loadHeartRate() {
        if (this.configVisibility.heartRate) {
            const heartRateMock = new HeartRate();
            heartRateMock.dataset = [
                { value: 50, timestamp: '2016-10-03T05:59:20' }, {
                    value: 143,
                    timestamp: '2014-09-26T09:35:11'
                }, { value: 5, timestamp: '2016-04-29T01:39:18' }, { value: 85, timestamp: '2014-10-12T02:14:09' }, {
                    value: 125,
                    timestamp: '2015-03-07T10:33:04'
                }, { value: 71, timestamp: '2015-02-03T02:02:05' }, { value: 134, timestamp: '2014-08-15T07:37:07' }, {
                    value: 126,
                    timestamp: '2016-03-31T07:06:59'
                }, { value: 54, timestamp: '2014-08-20T10:04:14' }, { value: 144, timestamp: '2014-03-08T08:13:13' }, {
                    value: 97,
                    timestamp: '2019-06-06T03:51:03'
                }, { value: 102, timestamp: '2015-12-15T07:44:19' }, { value: 133, timestamp: '2015-01-09T12:28:56' }, {
                    value: 30,
                    timestamp: '2018-03-31T11:40:35'
                }, { value: 42, timestamp: '2016-12-16T05:35:41' }, { value: 119, timestamp: '2014-10-22T09:18:48' }, {
                    value: 128,
                    timestamp: '2016-12-01T07:11:20'
                }, { value: 115, timestamp: '2015-11-09T12:33:34' }, { value: 26, timestamp: '2017-07-12T09:49:07' }, {
                    value: 124,
                    timestamp: '2019-07-27T08:57:29'
                }, { value: 92, timestamp: '2016-10-03T05:59:13' }, { value: 30, timestamp: '2019-11-16T03:52:47' }, {
                    value: 83,
                    timestamp: '2014-11-03T12:49:58'
                }, { value: 52, timestamp: '2015-10-01T07:57:48' }, { value: 59, timestamp: '2015-05-11T01:22:55' }, {
                    value: 48,
                    timestamp: '2017-03-06T09:20:24'
                }, { value: 143, timestamp: '2018-12-13T03:45:07' }, { value: 6, timestamp: '2018-04-19T04:26:40' }, {
                    value: 31,
                    timestamp: '2017-11-20T02:08:31'
                }, { value: 127, timestamp: '2018-05-27T07:01:44' }, { value: 20, timestamp: '2014-12-22T11:06:15' }, {
                    value: 76,
                    timestamp: '2017-06-18T02:21:36'
                }, { value: 104, timestamp: '2018-03-13T10:04:29' }, { value: 141, timestamp: '2017-10-11T11:48:58' }, {
                    value: 19,
                    timestamp: '2019-10-16T10:39:26'
                }, { value: 133, timestamp: '2016-11-12T05:04:00' }, { value: 147, timestamp: '2014-07-10T02:34:48' }, {
                    value: 19,
                    timestamp: '2018-01-02T10:47:17'
                }, { value: 35, timestamp: '2018-07-29T10:16:46' }, { value: 50, timestamp: '2019-09-29T07:24:52' }, {
                    value: 92,
                    timestamp: '2017-12-23T12:44:47'
                }, { value: 75, timestamp: '2017-10-18T03:08:08' }, { value: 123, timestamp: '2016-01-19T11:33:53' }, {
                    value: 66,
                    timestamp: '2014-10-28T12:54:37'
                }, { value: 53, timestamp: '2017-04-10T08:31:50' }, { value: 66, timestamp: '2016-03-20T09:10:58' }, {
                    value: 135,
                    timestamp: '2019-07-24T12:51:58'
                }, { value: 45, timestamp: '2015-05-01T08:30:10' }, { value: 77, timestamp: '2018-01-17T06:50:44' }, {
                    value: 130,
                    timestamp: '2017-10-27T12:43:22'
                }, { value: 118, timestamp: '2014-12-10T11:23:00' }, { value: 62, timestamp: '2017-06-02T05:20:43' }, {
                    value: 141,
                    timestamp: '2016-11-20T08:02:11'
                }, { value: 107, timestamp: '2015-01-31T02:36:54' }, { value: 52, timestamp: '2016-12-07T07:54:08' }, {
                    value: 51,
                    timestamp: '2016-11-30T11:49:40'
                }]
            this.graphOrdem.push('heartRate');
            if (!this.listHeartRate.length) {
                // this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.heart_rate, null, null, this.filter)
                //     .then(httpResponse => {
                //         this.listHeartRate = httpResponse.body;
                //     })
                //     .catch();
                this.listHeartRate = [heartRateMock]
            }
        } else {
            this.graphOrdem = this.graphOrdem.filter(item => item !== 'heartRate')
        }
    }

    loadSleep() {
        if (this.configVisibility.sleep) {

            const sleep = new Sleep()

            sleep.start_time = '2018-08-18T01:40:30.00Z';
            sleep.end_time = '2018-08-18T09:36:30.00Z';
            sleep.duration = 29520000;
            sleep.pattern = new Pattern()
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

            sleep.pattern.summary.asleep = new SleepStage()
            sleep.pattern.summary.asleep.count = 55;
            sleep.pattern.summary.asleep.duration = 28020000;

            sleep.pattern.summary.awake = new SleepStage()
            sleep.pattern.summary.awake.count = 5;
            sleep.pattern.summary.awake.duration = 28020000;

            sleep.pattern.summary.restless = new SleepStage()
            sleep.pattern.summary.restless.count = 40;
            sleep.pattern.summary.restless.duration = 28020000;

            const sleep3 = new Sleep()

            sleep3.start_time = '2018-08-18T01:40:30.00Z';
            sleep3.end_time = '2018-08-18T09:36:30.00Z';
            sleep3.duration = 34420000;
            sleep3.pattern = new Pattern()
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

            sleep3.pattern.summary.asleep = new SleepStage()
            sleep3.pattern.summary.asleep.count = 63;
            sleep3.pattern.summary.asleep.duration = 28020000;

            sleep3.pattern.summary.awake = new SleepStage()
            sleep3.pattern.summary.awake.count = 7;
            sleep3.pattern.summary.awake.duration = 28020000;

            sleep3.pattern.summary.restless = new SleepStage()
            sleep3.pattern.summary.restless.count = 30;
            sleep3.pattern.summary.restless.duration = 28020000;

            const sleep2 = new Sleep()

            sleep2.start_time = '2018-08-18T01:40:30.00Z';
            sleep2.end_time = '2018-08-18T09:36:30.00Z';
            sleep2.duration = 39720000;
            sleep2.pattern = new Pattern()
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

            sleep2.pattern.summary.asleep = new SleepStage()
            sleep2.pattern.summary.asleep.count = 45;
            sleep2.pattern.summary.asleep.duration = 28020000;

            sleep2.pattern.summary.awake = new SleepStage()
            sleep2.pattern.summary.awake.count = 5;
            sleep2.pattern.summary.awake.duration = 28020000;

            sleep2.pattern.summary.restless = new SleepStage()
            sleep2.pattern.summary.restless.count = 50;
            sleep2.pattern.summary.restless.duration = 28020000;


            this.graphOrdem.push('sleep');
            if (!this.listSleep.length) {
                // this.measurementService.getAllByUserAndType(this.patientId, EnumMeasurementType.sleep, null, null, this.filter)
                //     .then(httpResponse => {
                //         this.listSleep = httpResponse.body;
                //     })
                //     .catch();
                this.listSleep = [sleep, sleep2, sleep3]
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
