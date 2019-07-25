import { AfterViewChecked, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { LoadingService } from '../../../shared/shared-components/loading-component/service/loading.service';
import { SelectPilotStudyService } from '../../../shared/shared-components/select-pilotstudy/service/select-pilot-study.service';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { LocalStorageService } from '../../../shared/shared-services/localstorage.service';
import { ConfigurationBasic, PaginatorIntlService } from '../../config-matpaginator'

const PaginatorConfig = ConfigurationBasic;

@Component({
    selector: 'patient-table',
    templateUrl: './patient-table.component.html',
    styleUrls: ['./patient-table.component.scss']
})
export class PatientTableComponent implements OnInit, AfterViewChecked, OnChanges, OnDestroy {
    @Input() pilotStudyId;
    pageSizeOptions: number[];
    pageEvent: PageEvent;
    page: number;
    limit: number;
    length: number;
    listOfPatientsIsEmpty: boolean;
    listOfPatients = new Array<Patient>();
    search: string;
    searchTime;
    cacheIdPatientRemove: string;
    userId: string;

    private subscriptions: Array<ISubscription>;

    constructor(
        private patientService: PatientService,
        private paginatorService: PaginatorIntlService,
        private toastService: ToastrService,
        private modalService: ModalService,
        private loadinService: LoadingService,
        private selectStudyService: SelectPilotStudyService,
        private localStorageService: LocalStorageService,
        private translateService: TranslateService
    ) {
        this.page = PaginatorConfig.page;
        this.pageSizeOptions = PaginatorConfig.pageSizeOptions;
        this.limit = PaginatorConfig.limit;
        this.listOfPatientsIsEmpty = false;
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.subscriptions.push(this.selectStudyService.pilotStudyUpdated.subscribe(() => {
            this.loadPilotSelected();
            this.getAllPacients();
        }));
    }

    loadUser(): void {
        this.userId = this.localStorageService.getItem('user');
    }

    loadPilotSelected(): void {
        if (!this.userId) {
            this.loadUser();
        }
        const pilotselected = this.localStorageService.getItem(this.userId);
        if (pilotselected) {
            this.pilotStudyId = pilotselected;
        }
    }

    searchOnSubmit() {
        clearInterval(this.searchTime);
        this.searchTime = setTimeout(() => {
            this.patientService.getAllByPilotStudy(this.pilotStudyId, this.page, this.limit, this.search)
                .then(patients => {
                    this.listOfPatients = patients;
                    this.calcLengthPatients();
                    this.listOfPatientsIsEmpty = this.listOfPatients.length === 0;
                })
                .catch();
        }, 200);
    }

    getAllPacients() {
        this.patientService.getAllByPilotStudy(this.pilotStudyId, this.page, this.limit, this.search)
            .then(patients => {
                this.listOfPatients = patients;
                this.calcLengthPatients();
                this.listOfPatientsIsEmpty = this.listOfPatients.length === 0;
            })
            .catch();
    }

    clickPagination(event) {
        this.pageEvent = event;
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.getAllPacients();
    }

    openModalConfirmation(pilotstudy_id: string, patientId: string) {
        this.cacheIdPatientRemove = patientId;
        this.pilotStudyId = pilotstudy_id;
        this.modalService.open('modalConfirmation');
    }

    closeModalComfimation() {
        this.cacheIdPatientRemove = '';
        this.modalService.close('modalConfirmation');
    }

    removePatient() {
        this.patientService.remove(this.cacheIdPatientRemove)
            .then(() => {
                this.getAllPacients();
                this.calcLengthPatients();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PATIENT-REMOVED'));
                this.closeModalComfimation();
            })
            .catch(() => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-REMOVED'));
            });
    }

    getIndex(index: number): number {
        if (this.search) {
            return null;
        }
        return this.paginatorService.getIndex(this.pageEvent, this.limit, index);
    }

    calcLengthPatients() {
        this.patientService.getAllByPilotStudy(this.pilotStudyId, undefined, undefined, this.search)
            .then(patients => {
                this.length = patients.length;
            })
            .catch();
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((this.pilotStudyId && changes.pilotStudyId.currentValue !== changes.pilotStudyId.previousValue)) {
            this.getAllPacients();
        }
    }

    ngAfterViewChecked() {
        this.loadinService.close();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
