import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox'
import { EnumMeasurementType } from '../../measurement/models/measurement'
import { TimeSeriesType } from '../../activity/models/time.series'
import { EnumPilotStudyDataTypes } from '../models/pilot.study'

@Component({
    selector: 'pilot-study-config',
    templateUrl: './pilot.study.config.component.html',
    styleUrls: ['../shared.style/shared.style.scss']
})
export class PilotStudyConfigComponent implements OnChanges {
    @Output() change: EventEmitter<any>;
    @Input() dataTypes: string[];
    @Input() readOnly: string[];
    resources: Set<string>;
    measurementsTypes: string[];
    questionnairesTypes: string[];
    activitiesTypes: string[];
    timeSeriesTypes: string[];
    listCheckMeasurement: boolean[];
    measurementAll: boolean;
    listCheckQuestionnaries: boolean[];
    questionnairesAll: boolean;
    listCheckTimeSerie: boolean[];
    timeSeriesAll: boolean;
    listCheckActivities: boolean[];
    activitiesAll: boolean;

    constructor() {
        this.measurementsTypes = Object.keys(EnumMeasurementType).filter(measuremt => measuremt !== EnumMeasurementType.body_fat);
        this.questionnairesTypes = [EnumPilotStudyDataTypes.quest_nutritional, EnumPilotStudyDataTypes.quest_odontological];
        this.activitiesTypes = [EnumPilotStudyDataTypes.physical_activity, EnumPilotStudyDataTypes.sleep];
        this.timeSeriesTypes = Object.keys(TimeSeriesType);
        this.change = new EventEmitter<any>();
        this.resources = new Set<string>();
        this.dataTypes = [];
    }

    stopPropagation(event): void {
        if (this.readOnly) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    changeMeasurements(): void {
        if (!this.readOnly) {
            this.measurementAll = this.listCheckMeasurement.reduce((previousValue, currentValue) => {
                return previousValue && currentValue;
            })
            this.updateResources();
        }
    }

    selectAllMeasurements(change: MatCheckboxChange): void {
        if (!this.readOnly) {
            this.listCheckMeasurement = this.listCheckMeasurement.map(() => change.checked);
            this.updateResources();
        }
    }

    changeQuestionnaries(): void {
        if (!this.readOnly) {
            this.questionnairesAll = this.listCheckQuestionnaries.reduce((previousValue, currentValue) => {
                return previousValue && currentValue;
            });
            this.updateResources();
        }
    }

    selectAllQuestionnaires(change: MatCheckboxChange): void {
        if (!this.readOnly) {
            this.listCheckQuestionnaries = this.listCheckQuestionnaries.map(() => change.checked);
            this.updateResources();
        }
    }

    changeActivities(): void {
        if (!this.readOnly) {
            this.activitiesAll = this.listCheckActivities.reduce((previousValue, currentValue) => {
                return previousValue && currentValue;
            });
            this.updateResources();
        }
    }

    selectAllActivities(change: MatCheckboxChange): void {
        if (!this.readOnly) {
            this.listCheckActivities = this.listCheckActivities.map(() => change.checked);
            this.updateResources();
        }
    }

    changeTimeSeries(): void {
        if (!this.readOnly) {
            this.timeSeriesAll = this.listCheckTimeSerie.reduce((previousValue, currentValue) => {
                return previousValue && currentValue;
            });
            this.updateResources();
        }
    }

    selectAllTimeSeries(change: MatCheckboxChange): void {
        if (!this.readOnly) {
            this.listCheckTimeSerie = this.listCheckTimeSerie.map(() => change.checked);
            this.updateResources();
        }
    }

    updateResources(): void {
        this.listCheckMeasurement.forEach((measurement, index) => {
            if (measurement) {
                this.resources.add(this.measurementsTypes[index]);
            } else {
                this.resources.delete(this.measurementsTypes[index]);
            }
        });

        this.listCheckQuestionnaries.forEach((questionnaire, index) => {
            if (questionnaire) {
                this.resources.add(this.questionnairesTypes[index]);
            } else {
                this.resources.delete(this.questionnairesTypes[index]);
            }
        });

        this.listCheckActivities.forEach((questionnaire, index) => {
            if (questionnaire) {
                this.resources.add(this.activitiesTypes[index]);
            } else {
                this.resources.delete(this.activitiesTypes[index]);
            }
        });

        this.listCheckTimeSerie.forEach((questionnaire, index) => {
            if (questionnaire) {
                this.resources.add(this.timeSeriesTypes[index]);
            } else {
                this.resources.delete(this.timeSeriesTypes[index]);
            }
        });

        this.change.emit(this.resources);
    }

    insertDataTypes(): void {
        this.listCheckMeasurement = this.measurementsTypes.map((measurement) => this.dataTypes.includes(measurement));

        this.listCheckQuestionnaries = this.questionnairesTypes.map((questionnaire) => this.dataTypes.includes(questionnaire));

        this.listCheckActivities = this.activitiesTypes.map((activity) => this.dataTypes.includes(activity));

        this.listCheckTimeSerie = this.timeSeriesTypes.map((timeSerie) => this.dataTypes.includes(timeSerie));

        this.updateResources();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.dataTypes) {
            this.insertDataTypes();
        }
    }

}
