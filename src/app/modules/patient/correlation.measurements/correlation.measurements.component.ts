import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

import { PilotStudyService } from '../../pilot.study/services/pilot.study.service'
import { MeasurementService } from '../../measurement/services/measurement.service'
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'
import { TimeSeriesService } from '../../activity/services/time.series.service'
import { MeasurementTypePipe } from '../../measurement/pipes/measurement.type.pipe'
import { TimeSeriesPipe } from '../../activity/pipes/time.series.pipe'
import { EnumMeasurementType, SearchForPeriod } from '../../measurement/models/measurement'
import { TimeSeriesType } from '../../activity/models/time.series'

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

export interface Item {
    disabled?: boolean;
    value: string;
    viewValue: string;
}

export interface Group {
    disabled?: boolean;
    name: string;
    items: Item[];
}

@Component({
    selector: 'correlation-measurements',
    templateUrl: './correlation.measurements.component.html',
    styleUrls: ['./correlation.measurements.component.scss']
})
export class CorrelationMeasurementsComponent implements OnInit {
    @ViewChild('selectGraph01', { static: false }) selectGraph01;
    @ViewChild('selectGraph02', { static: false }) selectGraph02;
    @ViewChild('selectGraph03', { static: false }) selectGraph03;
    @ViewChild('selectGraph04', { static: false }) selectGraph04;
    @Input() configVisibility: ConfigVisibility;
    @Input() patientId;
    EnumMeasurementType = EnumMeasurementType;
    TimeSeriesType = TimeSeriesType;
    filter: any;
    filterForMeasurement: any;
    resourceGroups: Group[];
    resource01Selected: any;
    resource02Selected: any;
    resource03Selected: any;
    resource04Selected: any;

    constructor(
        private studyService: PilotStudyService,
        private measurementService: MeasurementService,
        private localStorageService: LocalStorageService,
        private activeRouter: ActivatedRoute,
        private timeSeriesService: TimeSeriesService,
        private translateService: TranslateService,
        private measurementPipe: MeasurementTypePipe,
        private timeSeriesPipe: TimeSeriesPipe
    ) {
        this.configVisibility = new ConfigVisibility();
        this.filter = {
            type: 'today',
            filter: {
                date: new Date().toISOString().split('T')[0],
                interval: '15m'
            }
        };
        this.filterForMeasurement = this.formatterFilter();
    }

    ngOnInit(): void {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
        });
        this.initializeMeasurementsGroup();
    }

    initializeMeasurementsGroup(): void {
        const measurement = this.translateService.instant('MEASUREMENTS.TITLE');
        const timeSeries = this.translateService.instant('TIME-SERIES.TITLE');
        const measurementsItems = Object.keys(EnumMeasurementType).map(item => {
            return {
                value: item,
                viewValue: this.translateService.instant(this.measurementPipe.transform(item))
            }
        })
        const timeSeriesItems = Object.keys(TimeSeriesType).map(item => {
            return {
                value: item,
                viewValue: this.translateService.instant(this.timeSeriesPipe.transform(item))
            }
        })
        this.resourceGroups = [
            {
                name: measurement,
                items: measurementsItems
            },
            {
                name: timeSeries,
                items: timeSeriesItems
            }
        ];
    }

    selectResource(): void {
        this.resourceGroups[0].items = this.resourceGroups[0].items.map((item: Item) => {
            item.disabled = (item.value === this.resource01Selected || item.value === this.resource02Selected ||
                item.value === this.resource03Selected || item.value === this.resource04Selected);
            return item
        })

        this.resourceGroups[1].items = this.resourceGroups[1].items.filter((item: Item) => {
            item.disabled = (item.value === this.resource01Selected || item.value === this.resource02Selected ||
                item.value === this.resource03Selected || item.value === this.resource04Selected);
            return item
        })
    }

    applyFilter(event: any) {
        this.filter = event;
        this.filterForMeasurement = this.formatterFilter();
    }

    formatterFilter(): SearchForPeriod {
        if (this.filter) {
            if (this.filter.period) {
                return this.filter
            }
            const result: SearchForPeriod = {
                period: this.filter['type'],
                start_at: this.filter['filter']['start_date'],
                end_at: this.filter['filter']['end_date']
            };
            return result;
        }
        return this.filter
    }

    openSelectGraph(event): void {
        this[event].open();
    }


}
