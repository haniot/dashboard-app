import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup } from '@angular/forms'

import { TranslateService } from '@ngx-translate/core'

import { ExternalService, SynchronizeData } from '../models/external.service'
import { FitbitStatusPipe } from '../../../shared/shared.pipes/pipes/fitbit.status.pipe'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { FitbitService } from '../../../shared/shared.services/fitbit.service'
import { ToastrService } from 'ngx-toastr'

@Component({
    selector: 'external-service',
    templateUrl: './external.service.component.html',
    styleUrls: ['./external.service.component.scss']
})
export class ExternalServiceComponent implements OnInit, OnChanges {
    @Input() patientId: string;
    @Input() externalService: ExternalService;
    patientForm: FormGroup;
    synchronizing: boolean;
    revoking: boolean;
    synchronizeData: SynchronizeData;

    constructor(
        private fb: FormBuilder,
        private translateService: TranslateService,
        private fitbitStatusPipe: FitbitStatusPipe,
        private datePipe: DatePipe,
        private modalService: ModalService,
        private fitbitService: FitbitService,
        private toastService: ToastrService
    ) {
        this.patientForm = new FormGroup({});
        this.synchronizeData = new SynchronizeData();
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.patientForm = this.fb.group({
            external_services: this.fb.group({
                fitbit_status: [{ value: '', disabled: true }],
                fitbit_last_sync: [{ value: '', disabled: true }]
            })
        });
    }

    setPatientInForm() {
        this.patientForm = this.fb.group({
            external_services: this.fb.group({
                fitbit_status: [
                    this.translateService.instant(
                        this.fitbitStatusPipe.transform(this.externalService.fitbit_status)
                    )
                ],
                fitbit_last_sync: this.externalService.fitbit_last_sync ? [
                    this.datePipe.transform(this.externalService.fitbit_last_sync) +
                    ' ' + this.translateService.instant('SHARED.AT') + ' ' +
                    this.datePipe.transform(this.externalService.fitbit_last_sync, 'mediumTime')
                ] : [' - - ']
            })
        });
    }

    synchronize(): void {
        this.synchronizing = true;
        this.fitbitService.synchronize(this.patientId)
            .then(synchronizeData => {
                this.synchronizeData = synchronizeData;
                this.synchronizing = false;
                this.modalService.open('synchronized');
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.SYNCHRONIZE-SUCCESSFULLY'))
            })
            .catch(() => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.COULD-NOT-SYNC'))
                this.synchronizing = false;
            })
    }

    openModalRevoke(): void {
        this.modalService.open('modalConfirmation');
    }

    revoke(): void {
        this.closeModalRevoke();
        this.revoking = true;
        this.fitbitService.revoke(this.patientId)
            .then(() => {
                this.modalService.close('modalConfirmation');
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.REVOKED-SUCCESSFULLY'));
                this.revoking = false;
            })
            .catch(() => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.COULD-NOT-REVOKE'));
                this.revoking = false;
            })
    }

    closeModalSynchronized(): void {
        this.modalService.close('synchronized');
    }

    closeModalRevoke(): void {
        this.modalService.close('modalConfirmation');
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setPatientInForm()
    }
}
