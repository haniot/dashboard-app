import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { SearchForPeriod } from '../models/measurement'
import { MeasurementService } from '../services/measurement.service'
import { TimeSeries, TimeSeriesType } from '../models/time.series'

@Component({
    selector: 'view-timestamp',
    templateUrl: './view.timestamp.component.html',
    styleUrls: ['../shared.style/shared.styles.scss']
})
export class ViewTimestampComponent implements OnChanges {
    @Input() patientId: string;
    @Input() typeOfTimeSeries: TimeSeriesType;
    list: Array<any>;
    listIsEmpty: boolean;
    filter: SearchForPeriod;
    TimeSeriesType = TimeSeriesType;

    constructor(private measurementService: MeasurementService) {
        const step = new TimeSeries()
        step.data_set = [
            {
                value: 60000,
                date: '2018-08-18T01:40:30.00Z'

            },
            {
                date: '2018-08-18T01:41:30.00Z',
                value: 360000
            },
            {
                date: '2018-08-18T01:47:30.00Z',
                value: 240000
            },
            {
                date: '2018-08-18T01:51:30.00Z',
                value: 60000
            },
            {
                date: '2018-08-18T01:52:30.00Z',
                value: 60000
            },
            {
                date: '2018-08-18T01:53:30.00Z',
                value: 2100000
            },
            {
                date: '2018-08-18T02:28:30.00Z',
                value: 240000
            },
            {
                date: '2018-08-18T02:32:30.00Z',
                value: 180000
            },
            {
                date: '2018-08-18T02:35:30.00Z',
                value: 15120000
            },
            {
                date: '2018-08-18T06:47:30.00Z',
                value: 60000
            },
            {
                date: '2018-08-18T06:48:30.00Z',
                value: 2580000
            },
            {
                date: '2018-08-18T07:31:30.00Z',
                value: 120000
            },
            {
                date: '2018-08-18T07:33:30.00Z',
                value: 120000
            },
            {
                date: '2018-08-18T07:35:30.00Z',
                value: 60000
            },
            {
                date: '2018-08-18T07:36:30.00Z',
                value: 1200000
            },
            {
                date: '2018-08-18T07:56:30.00Z',
                value: 60000
            },
            {
                date: '2018-08-18T07:57:30.00Z',
                value: 2580000
            },
            {
                date: '2018-08-18T08:40:30.00Z',
                value: 180000
            },
            {
                date: '2018-08-18T08:43:30.00Z',
                value: 1200000
            },
            {
                date: '2018-08-18T09:03:30.00Z',
                value: 60000
            },
            {
                date: '2018-08-18T09:04:30.00Z',
                value: 1740000
            },
            {
                date: '2018-08-18T09:03:30.00Z',
                value: 180000
            },
            {
                date: '2018-08-18T09:36:30.00Z',
                value: 960000
            }

        ];
        this.list = [step];
        this.listIsEmpty = false;
        // this.filter = { start_at: null, end_at: new Date().toISOString().split('T')[0], period: 'today' };
    }

    loadMeasurements(typeSelected: TimeSeriesType): any {
        console.log(typeSelected)
        this.list = []
        /* Mocks*/
        if (typeSelected === TimeSeriesType.heart_rate) {
            const heartRateMock = new TimeSeries();
            heartRateMock.data_set = [
                { value: 50, date: '2016-10-03T05:59:20' }, {
                    value: 143,
                    date: '2014-09-26T09:35:11'
                }, { value: 5, date: '2016-04-29T01:39:18' }, { value: 85, date: '2014-10-12T02:14:09' }, {
                    value: 125,
                    date: '2015-03-07T10:33:04'
                }, { value: 71, date: '2015-02-03T02:02:05' }, { value: 134, date: '2014-08-15T07:37:07' }, {
                    value: 126,
                    date: '2016-03-31T07:06:59'
                }, { value: 54, date: '2014-08-20T10:04:14' }, { value: 144, date: '2014-03-08T08:13:13' }, {
                    value: 97,
                    date: '2019-06-06T03:51:03'
                }, { value: 102, date: '2015-12-15T07:44:19' }, { value: 133, date: '2015-01-09T12:28:56' }, {
                    value: 30,
                    date: '2018-03-31T11:40:35'
                }, { value: 42, date: '2016-12-16T05:35:41' }, { value: 119, date: '2014-10-22T09:18:48' }, {
                    value: 128,
                    date: '2016-12-01T07:11:20'
                }, { value: 115, date: '2015-11-09T12:33:34' }, { value: 26, date: '2017-07-12T09:49:07' }, {
                    value: 124,
                    date: '2019-07-27T08:57:29'
                }, { value: 92, date: '2016-10-03T05:59:13' }, { value: 30, date: '2019-11-16T03:52:47' }, {
                    value: 83,
                    date: '2014-11-03T12:49:58'
                }, { value: 52, date: '2015-10-01T07:57:48' }, { value: 59, date: '2015-05-11T01:22:55' }, {
                    value: 48,
                    date: '2017-03-06T09:20:24'
                }, { value: 143, date: '2018-12-13T03:45:07' }, { value: 6, date: '2018-04-19T04:26:40' }, {
                    value: 31,
                    date: '2017-11-20T02:08:31'
                }, { value: 127, date: '2018-05-27T07:01:44' }, { value: 20, date: '2014-12-22T11:06:15' }, {
                    value: 76,
                    date: '2017-06-18T02:21:36'
                }, { value: 104, date: '2018-03-13T10:04:29' }, { value: 141, date: '2017-10-11T11:48:58' }, {
                    value: 19,
                    date: '2019-10-16T10:39:26'
                }, { value: 133, date: '2016-11-12T05:04:00' }, { value: 147, date: '2014-07-10T02:34:48' }, {
                    value: 19,
                    date: '2018-01-02T10:47:17'
                }, { value: 35, date: '2018-07-29T10:16:46' }, { value: 50, date: '2019-09-29T07:24:52' }, {
                    value: 92,
                    date: '2017-12-23T12:44:47'
                }, { value: 75, date: '2017-10-18T03:08:08' }, { value: 123, date: '2016-01-19T11:33:53' }, {
                    value: 66,
                    date: '2014-10-28T12:54:37'
                }, { value: 53, date: '2017-04-10T08:31:50' }, { value: 66, date: '2016-03-20T09:10:58' }, {
                    value: 135,
                    date: '2019-07-24T12:51:58'
                }, { value: 45, date: '2015-05-01T08:30:10' }, { value: 77, date: '2018-01-17T06:50:44' }, {
                    value: 130,
                    date: '2017-10-27T12:43:22'
                }, { value: 118, date: '2014-12-10T11:23:00' }, { value: 62, date: '2017-06-02T05:20:43' }, {
                    value: 141,
                    date: '2016-11-20T08:02:11'
                }, { value: 107, date: '2015-01-31T02:36:54' }, { value: 52, date: '2016-12-07T07:54:08' }, {
                    value: 51,
                    date: '2016-11-30T11:49:40'
                }]
            return this.list = [heartRateMock];
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
