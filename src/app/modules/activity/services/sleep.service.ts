import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment'
import {
    Sleep,
    SleepPattern,
    SleepPatternPhaseSummary,
    SleepPatternStageSummary,
    SleepPatternSummaryData,
    SleepType
} from '../models/sleep'
import { SearchForPeriod } from '../../measurement/models/measurement'

@Injectable()
export class SleepService {
    version: string;

    constructor(private http: HttpClient) {
        this.version = 'v1';
    }

    create(patientId: string, sleep: Sleep): Promise<Sleep> {
        return this.http.post<any>(`${environment.api_url}/${this.version}/patients/${patientId}/sleep`, sleep)
            .toPromise();
    }

    getAll(patientId: string, page?: number, limit?: number, search?: SearchForPeriod): Promise<HttpResponse<Sleep[]>> {

        const httpResponse: HttpResponse<Sleep[]> = new HttpResponse()
        // @ts-ignore
        httpResponse.headers = new HttpHeaders().append('x-total-count', '3');

        const sleep = new Sleep()
        sleep.id = '5d7fb217336ca0101294677d';
        sleep.type = SleepType.CLASSIC;
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

        sleep.pattern.summary = new SleepPatternPhaseSummary();
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
        sleep3.type = SleepType.CLASSIC;
        sleep3.id = '5d7fb217336ca0301294677f';
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

        sleep3.pattern.summary = new SleepPatternPhaseSummary();
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
        sleep2.id = '5d7fb217336ca0201294677e';
        sleep2.type = SleepType.STAGES;
        sleep2.start_time = '2018-08-18T01:40:30.00Z';
        sleep2.end_time = '2018-08-18T09:36:30.00Z';
        sleep2.duration = 39720000;
        sleep2.pattern = new SleepPattern()
        sleep2.pattern.data_set = [
            {
                start_time: '2018-08-18T01:40:30.00Z',
                name: 'deep',
                duration: 60000
            },
            {
                start_time: '2018-08-18T01:41:30.00Z',
                name: 'rem',
                duration: 360000
            },
            {
                start_time: '2018-08-18T01:47:30.00Z',
                name: 'rem',
                duration: 240000
            },
            {
                start_time: '2018-08-18T01:51:30.00Z',
                name: 'deep',
                duration: 60000
            },
            {
                start_time: '2018-08-18T01:52:30.00Z',
                name: 'light',
                duration: 60000
            },
            {
                start_time: '2018-08-18T01:53:30.00Z',
                name: 'rem',
                duration: 2100000
            },
            {
                start_time: '2018-08-18T02:28:30.00Z',
                name: 'deep',
                duration: 240000
            },
            {
                start_time: '2018-08-18T02:32:30.00Z',
                name: 'awake',
                duration: 180000
            },
            {
                start_time: '2018-08-18T02:35:30.00Z',
                name: 'rem',
                duration: 15120000
            },
            {
                start_time: '2018-08-18T06:47:30.00Z',
                name: 'light',
                duration: 60000
            },
            {
                start_time: '2018-08-18T06:48:30.00Z',
                name: 'rem',
                duration: 2580000
            },
            {
                start_time: '2018-08-18T07:31:30.00Z',
                name: 'deep',
                duration: 120000
            },
            {
                start_time: '2018-08-18T07:33:30.00Z',
                name: 'light',
                duration: 120000
            },
            {
                start_time: '2018-08-18T07:35:30.00Z',
                name: 'rem',
                duration: 60000
            },
            {
                start_time: '2018-08-18T07:36:30.00Z',
                name: 'light',
                duration: 1200000
            },
            {
                start_time: '2018-08-18T07:56:30.00Z',
                name: 'deep',
                duration: 60000
            }
        ];

        sleep2.pattern.summary = new SleepPatternStageSummary();
        sleep2.pattern.summary.deep = new SleepPatternSummaryData()
        sleep2.pattern.summary.deep.count = 45;
        sleep2.pattern.summary.deep.duration = 28020000;

        sleep2.pattern.summary.light = new SleepPatternSummaryData()
        sleep2.pattern.summary.light.count = 50;
        sleep2.pattern.summary.light.duration = 28020000;

        sleep2.pattern.summary.rem = new SleepPatternSummaryData()
        sleep2.pattern.summary.rem.count = 50;
        sleep2.pattern.summary.rem.duration = 28020000;

        sleep2.pattern.summary.awake = new SleepPatternSummaryData()
        sleep2.pattern.summary.awake.count = 5;
        sleep2.pattern.summary.awake.duration = 28020000;

        // @ts-ignore
        httpResponse.body = [sleep, sleep2, sleep3];

        return Promise.resolve(httpResponse);


        let myParams = new HttpParams();

        if (page) {
            myParams = myParams.append('page', String(page));
        }

        if (limit) {
            myParams = myParams.append('limit', String(limit));
        }

        if (search) {
            if (search.start_at) {
                myParams = myParams.append('start_at', search.start_at);
            }
            if (search.end_at) {
                myParams = myParams.append('end_at', search.end_at);
            }
            if (search.period) {
                myParams = myParams.append('period', search.period);
            }
        }

        myParams = myParams.append('sort', '+timestamp');

        const url = `${environment.api_url}/${this.version}/patients/${patientId}/sleep`;

        return this.http.get<any>(url, { observe: 'response', params: myParams })
            .toPromise();
    }

    getById(patientId: string, sleepId: string): Promise<Sleep> {
        const sleep = new Sleep()
        sleep.id = '5d7fb217336ca0101294677d';
        sleep.type = SleepType.CLASSIC;
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

        sleep.pattern.summary = new SleepPatternPhaseSummary();
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
        sleep3.type = SleepType.CLASSIC;
        sleep3.id = '5d7fb217336ca0301294677f';
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

        sleep3.pattern.summary = new SleepPatternPhaseSummary();
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
        sleep2.id = '5d7fb217336ca0201294677e';
        sleep2.type = SleepType.STAGES;
        sleep2.start_time = '2018-08-18T01:40:30.00Z';
        sleep2.end_time = '2018-08-18T09:36:30.00Z';
        sleep2.duration = 39720000;
        sleep2.pattern = new SleepPattern()
        sleep2.pattern.data_set = [
            {
                start_time: '2018-08-18T01:40:30.00Z',
                name: 'deep',
                duration: 60000
            },
            {
                start_time: '2018-08-18T01:41:30.00Z',
                name: 'rem',
                duration: 360000
            },
            {
                start_time: '2018-08-18T01:47:30.00Z',
                name: 'rem',
                duration: 240000
            },
            {
                start_time: '2018-08-18T01:51:30.00Z',
                name: 'deep',
                duration: 60000
            },
            {
                start_time: '2018-08-18T01:52:30.00Z',
                name: 'light',
                duration: 60000
            },
            {
                start_time: '2018-08-18T01:53:30.00Z',
                name: 'rem',
                duration: 2100000
            },
            {
                start_time: '2018-08-18T02:28:30.00Z',
                name: 'deep',
                duration: 240000
            },
            {
                start_time: '2018-08-18T02:32:30.00Z',
                name: 'awake',
                duration: 180000
            },
            {
                start_time: '2018-08-18T02:35:30.00Z',
                name: 'rem',
                duration: 15120000
            },
            {
                start_time: '2018-08-18T06:47:30.00Z',
                name: 'light',
                duration: 60000
            },
            {
                start_time: '2018-08-18T06:48:30.00Z',
                name: 'rem',
                duration: 2580000
            },
            {
                start_time: '2018-08-18T07:31:30.00Z',
                name: 'deep',
                duration: 120000
            },
            {
                start_time: '2018-08-18T07:33:30.00Z',
                name: 'light',
                duration: 120000
            },
            {
                start_time: '2018-08-18T07:35:30.00Z',
                name: 'rem',
                duration: 60000
            },
            {
                start_time: '2018-08-18T07:36:30.00Z',
                name: 'light',
                duration: 1200000
            },
            {
                start_time: '2018-08-18T07:56:30.00Z',
                name: 'deep',
                duration: 60000
            }
        ];

        sleep2.pattern.summary = new SleepPatternStageSummary();
        sleep2.pattern.summary.deep = new SleepPatternSummaryData()
        sleep2.pattern.summary.deep.count = 45;
        sleep2.pattern.summary.deep.duration = 28020000;

        sleep2.pattern.summary.light = new SleepPatternSummaryData()
        sleep2.pattern.summary.light.count = 50;
        sleep2.pattern.summary.light.duration = 28020000;

        sleep2.pattern.summary.rem = new SleepPatternSummaryData()
        sleep2.pattern.summary.rem.count = 50;
        sleep2.pattern.summary.rem.duration = 28020000;

        sleep2.pattern.summary.awake = new SleepPatternSummaryData()
        sleep2.pattern.summary.awake.count = 5;
        sleep2.pattern.summary.awake.duration = 28020000;


        switch (sleepId) {
            case sleep.id:
                return Promise.resolve(sleep)

            case sleep2.id:
                return Promise.resolve(sleep2)

            case sleep3.id:
                return Promise.resolve(sleep3)

            default:
                return Promise.resolve(sleep)
        }

        return this.http.get<any>(`${environment.api_url}/${this.version}/patients/${patientId}/sleep/${sleepId}`)
            .toPromise();
    }

    remove(patientId: string, sleepId: string): Promise<any> {
        return this.http.delete<any>(`${environment.api_url}/${this.version}/patients/${patientId}/sleep/${sleepId}`)
            .toPromise();
    }

}
