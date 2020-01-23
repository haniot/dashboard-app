import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageEvent } from '@angular/material/paginator';

import { PhysicalActivity } from '../models/physical.activity';
import { SearchForPeriod } from '../../measurement/models/measurement';
import {
    TimeSeriesFullFilter,
    TimeSeriesIntervalFilter,
    TimeSeriesSimpleFilter,
    TimeSeriesType
} from '../models/time.series';
import { ConfigurationBasic } from '../../config.matpaginator';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { PhysicalActivitiesService } from '../services/physical.activities.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'app-activity.list',
    templateUrl: './activity.list.component.html',
    styleUrls: ['../shared.style/shared.styles.scss', './activity.list.component.scss']
})
export class ActivityListComponent implements OnInit {
    data: PhysicalActivity[];
    patientId: string;
    timeSerieSelected: TimeSeriesType;
    timeSeriesTypes: any;
    currentDate: Date;
    selectAll: boolean;
    stateButtonRemoveSelected: boolean;
    showSpinner: boolean;
    listCheckActivities: boolean[];
    Math = Math;
    filter: SearchForPeriod;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    cacheIdForRemove: string;
    cacheListIdForRemove: Array<any>;
    removingActivity: boolean;
    currentFilter: TimeSeriesSimpleFilter | TimeSeriesIntervalFilter | TimeSeriesFullFilter;
    isIntraday: boolean;

    constructor(
        private activeRouter: ActivatedRoute,
        private activityService: PhysicalActivitiesService,
        private router: Router,
        private modalService: ModalService,
        private toastService: ToastrService,
        private translateService: TranslateService) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.filter = new SearchForPeriod();
        this.cacheListIdForRemove = new Array<string>();
        this.timeSeriesTypes = [TimeSeriesType.steps, TimeSeriesType.calories, TimeSeriesType.distance];
        this.timeSerieSelected = TimeSeriesType.steps;
        this.data = [];
        this.currentDate = new Date();
        this.currentFilter = new TimeSeriesIntervalFilter();
        this.currentFilter.date = this.currentDate.toISOString().split('T')[0];
        this.currentFilter.interval = '1m';
        this.isIntraday = true;
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.loadAllActivities();
        })
    }

    applyFilter(event): void {
        this.currentFilter = event.filter;
        this.isIntraday = (event && event.type && event.type === 'today');
    }

    loadAllActivities(): void {
        this.data = [];
        this.showSpinner = true;
        this.activityService.getAll(this.patientId, this.page, this.limit)
            .then(httpResponse => {
                this.data = httpResponse && httpResponse.body ? httpResponse.body : [];
                this.length = httpResponse && httpResponse.headers ? parseInt(httpResponse.headers.get('x-total-count'), 10) : 0;
                this.initializeListChecks();
                this.showSpinner = false;
            })
            .catch(err => {
                this.showSpinner = false;
            })
    }

    changeOnActivity(): void {
        const activitiesSelected = this.listCheckActivities.filter(element => element === true);
        this.selectAll = this.data.length === activitiesSelected.length;
        this.updateStateButtonRemoveSelected();
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.loadAllActivities();
    }

    closeModalConfirmation() {
        this.cacheIdForRemove = '';
        this.modalService.close('modalConfirmation');
    }

    initializeListChecks(): void {
        this.selectAll = false;
        this.listCheckActivities = new Array<boolean>(this.data.length);
        for (let i = 0; i < this.listCheckActivities.length; i++) {
            this.listCheckActivities[i] = false;
        }
        this.updateStateButtonRemoveSelected();
    }

    selectAllActivities(): void {
        const attribSelectAll = (element: any) => {
            return !this.selectAll;
        }
        this.listCheckActivities = this.listCheckActivities.map(attribSelectAll);
        this.updateStateButtonRemoveSelected();
    }

    async remove(): Promise<any> {
        this.modalService.close('modalConfirmation');
        this.removingActivity = true;
        if (this.cacheIdForRemove) {
            this.activityService.remove(this.patientId, this.cacheIdForRemove)
                .then(measurements => {
                    this.applyFilter(this.filter);
                    this.removingActivity = false;
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-REMOVED'));
                })
                .catch(() => {
                    this.removingActivity = false;
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-NOT-REMOVED'));
                })
        } else {
            let occuredError = false;
            for (let i = 0; i < this.cacheListIdForRemove.length; i++) {
                try {
                    const activityRemove = this.cacheListIdForRemove[i];
                    await this.activityService.remove(this.patientId, activityRemove);
                } catch (e) {
                    occuredError = true;
                }
            }
            occuredError ? this.toastService
                    .error(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-NOT-REMOVED'))
                : this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PHYSICAL-ACTIVITY-REMOVED'));

            this.applyFilter(this.filter);
            this.removingActivity = false;
        }
    }

    removeSelected(): void {
        const activitiesIdSelected: Array<string> = new Array<string>();
        this.listCheckActivities.forEach((element, index) => {
            if (element) {
                activitiesIdSelected.push(this.data[index].id);
            }
        })
        this.cacheListIdForRemove = activitiesIdSelected;
        this.openModalConfirmation('')
    }

    viewActivityDetails(activityId: string): void {
        this.router.navigate(['/app/activities', this.patientId, 'physical_activity', activityId]);
    }

    openModalConfirmation(activityId: string): void {
        this.modalService.open('modalConfirmation');
        this.cacheIdForRemove = activityId;
    }

    updateStateButtonRemoveSelected(): void {
        const activitiesSelected = this.listCheckActivities.filter(element => element === true);
        this.stateButtonRemoveSelected = !!activitiesSelected.length;
    }

    trackById(index, item: PhysicalActivity) {
        return item.id
    }

}
