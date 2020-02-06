import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

import { PilotStudyService } from '../../pilot.study/services/pilot.study.service'
import { MeasurementService } from '../../measurement/services/measurement.service'
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'
import { TimeSeriesService } from '../../activity/services/time.series.service'
import { MeasurementTypePipe } from '../../measurement/pipes/measurement.type.pipe'
import { TimeSeriesPipe } from '../../activity/pipes/time.series.pipe'
import { EnumMeasurementType } from '../../measurement/models/measurement'
import { TimeSeriesIntervalFilter, TimeSeriesSimpleFilter, TimeSeriesType } from '../../activity/models/time.series'

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
    selector: 'correlate-measurements',
    templateUrl: './correlate.measurements.component.html',
    styleUrls: ['./correlate.measurements.component.scss']
})
export class CorrelateMeasurementsComponent implements OnInit {
    @ViewChildren('selectGraph') selectGraphs: QueryList<any>;
    @Input() configVisibility: ConfigVisibility;
    @Input() patientId;
    intraday: boolean;
    EnumMeasurementType = EnumMeasurementType;
    TimeSeriesType = TimeSeriesType;
    filter: TimeSeriesIntervalFilter;
    resourceGroups: Group[];
    resourcesSelected: any[];
    resourcesOptions: string[];

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
        this.filter = new TimeSeriesIntervalFilter();
        this.filter.date = new Date().toISOString().split('T')[0];
        this.filter.interval = '15m';
        this.resourcesSelected = new Array(1);
        this.resourcesOptions = ['hidden'];
        this.intraday = true;
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
            item.disabled = this.resourcesSelected.includes(item.value);
            return item
        })

        this.resourceGroups[1].items = this.resourceGroups[1].items.filter((item: Item) => {
            item.disabled = this.resourcesSelected.includes(item.value);
            return item
        })
    }

    applyFilter(event: any) {
        this.intraday = event.type === 'today';
        this.filter = event;
    }

    add(): void {
        this.resourcesSelected.push(undefined);
        this.resourcesOptions.push('hidden');
    }

    openSelectGraph(indexSelected: number): void {
        this.selectGraphs.forEach((element, index) => {
            if (index === indexSelected) {
                element.open();
            }
        })
    }

    removeGraph(indexSelected: number): void {
        this.resourcesSelected = this.resourcesSelected.filter((element, index) => {
            return indexSelected !== index;
        });
    }
}
