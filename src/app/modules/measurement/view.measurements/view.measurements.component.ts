import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MeasurementService } from '../services/measurement.service'
import { EnumMeasurementType, SearchForPeriod } from '../models/measurement'
import { Sleep, SleepPattern, SleepPatternSummaryData, SleepPhases } from '../../activity/models/sleep'

@Component({
    selector: 'view-measurements',
    templateUrl: './view.measurements.component.html',
    styleUrls: ['./view.measurements.component.scss']
})
export class ViewMeasurementsComponent implements OnChanges {
    @Input() patientId: string;
    @Input() typeOfMeasurement: string;
    list: Array<any>;
    listIsEmpty: boolean;
    filter: SearchForPeriod;
    allTypesOfMeasurement = EnumMeasurementType;

    constructor(private measurementService: MeasurementService) {
        this.list = []
        this.listIsEmpty = false;
        // this.filter = { start_at: null, end_at: new Date().toISOString().split('T')[0], period: 'today' };
    }

    loadMeasurements(typeSelected: EnumMeasurementType | string): any {
        this.list = []
        /* Mocks*/
        if (typeSelected === 'sleep') {
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

            return this.list = [sleep, sleep2, sleep3];
        }

        this.measurementService.getAllByUserAndType(this.patientId, typeSelected, null, null, this.filter)
            .then((httpResponse) => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.list = httpResponse.body;
                    this.listIsEmpty = this.list.length === 0;
                }
            })
            .catch(() => {
                this.listIsEmpty = true;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.typeOfMeasurement) {
            this.loadMeasurements(changes.typeOfMeasurement.currentValue);
        }
    }
}
