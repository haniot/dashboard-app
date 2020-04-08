import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';

import { PilotStudyService } from '../../pilot.study/services/pilot.study.service';
import { MeasurementService } from '../../measurement/services/measurement.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service';
import { TimeSeriesService } from '../../activity/services/time.series.service';
import { MeasurementTypePipe } from '../../measurement/pipes/measurement.type.pipe';
import { TimeSeriesPipe } from '../../activity/pipes/time.series.pipe';
import { EnumMeasurementType } from '../../measurement/models/measurement';
import {
    defaultIntervalIntraday,
    Intervals,
    TimeSeriesIntervalFilter,
    TimeSeriesType
} from '../../activity/models/time.series';

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
    selector: 'graphic-study',
    templateUrl: './graphic.study.component.html',
    styleUrls: ['./graphic.study.component.scss']
})
export class GraphicStudyComponent implements OnInit {
    Math = Math;
    public options: GridsterConfig;
    @ViewChildren('selectGraph') selectGraphs: QueryList<any>;
    @Input() configVisibility: ConfigVisibility;
    @Input() patientId;
    intraday: boolean;
    EnumMeasurementType = EnumMeasurementType;
    TimeSeriesType = TimeSeriesType;
    filter: TimeSeriesIntervalFilter;
    resourceGroups: Group[];
    resourcesSelected: GridsterItem[];
    resourcesOptions: string[];
    select: string;
    grid: any;
    widthGridSister = 288;

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
        this.filter.interval = defaultIntervalIntraday;
        this.resourcesSelected = [];
        this.resourcesOptions = [];
        this.intraday = true;

        this.options = {
            pushItems: true,
            outerMargin: true,
            margin: 2,
            minCols: 1,
            maxCols: 2,
            displayGrid: 'always',
            minRows: 1,
            maxRows: 2,
            swap: true,
            swapWhileDragging: true,
            setGridSize: true,
            mobileBreakpoint: 640,
            gridType: 'fit',
            resizable: {
                enabled: true
            },
            draggable: {
                enabled: true
            }
        };

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

    selectResource(event): void {
        this.add(event.value);
        this.updateResourceGroups();
        setTimeout(() => {
            this.select = ''
        }, 300)
    }

    updateResourceGroups(): void {
        this.resourceGroups[0].items = this.resourceGroups[0].items.map((item: Item) => {
            item.disabled = !!this.resourcesSelected.find(element => {
                return element.resource === item.value
            })
            return item
        })

        this.resourceGroups[1].items = this.resourceGroups[1].items.filter((item: Item) => {
            item.disabled = !!this.resourcesSelected.find(element => {
                return element.resource === item.value
            })
            return item
        })
    }

    openSelectGraph(indexSelected: number): void {
        this.selectGraphs.forEach((element, index) => {
            if (index === indexSelected) {
                element.open();
            }
        })
    }

    changeSelected(selected, index): void {
        this.resourcesSelected[index].resource = selected.value;
    }

    applyFilter(event: any) {
        this.intraday = event.type === 'today';
        this.filter = event;
    }

    add(resource: EnumMeasurementType): void {
        const x = this.resourcesSelected.length % 2 === 0 ? 0 : 1;
        this.resourcesSelected.push({
            x: x,
            y: 0,
            rows: 1,
            cols: 1,
            resource: resource
        });
        this.resourcesOptions.push('hidden');
        this.updateWidthGridSister();
    }

    updateWidthGridSister(): void {
        if (this.resourcesSelected && this.resourcesSelected.length) {
            const round = Math.round(this.resourcesSelected.length / 2);
            if (round) {
                this.options.maxRows = round;
                this.options.api.optionsChanged();
            }
            this.widthGridSister = round ? round * 288 : 288;
        }
    }

    getTitle(resource: EnumMeasurementType | TimeSeriesType): string {
        if (Object.keys(EnumMeasurementType).includes(resource)) {
            return this.translateService.instant(this.measurementPipe.transform(resource));
        }
        return this.translateService.instant(this.timeSeriesPipe.transform(resource));
    }

    removeGraph(indexSelected: number): void {
        this.resourcesSelected = this.resourcesSelected.filter((element, index) => {
            return indexSelected !== index;
        });
        this.updateResourceGroups();
    }
}
