import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup } from '@angular/forms'

import { TranslateService } from '@ngx-translate/core'
import { ToastrService } from 'ngx-toastr';

import { ExternalService, OAuthUser, SynchronizeData } from '../models/external.service';
import { FitbitStatusPipe } from '../../../shared/shared.pipes/pipes/fitbit.status.pipe';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service';
import { FitbitService } from '../../../shared/shared.services/fitbit.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'external-service',
    templateUrl: './external.service.component.html',
    styleUrls: ['./external.service.component.scss']
})
export class ExternalServiceComponent implements OnInit, OnDestroy {
    @Input() patientId: string;
    @Input() externalServices: ExternalService[];
    @Output() promotedAccess: EventEmitter<any>;
    patientForm: FormGroup;
    synchronizing: boolean;
    revoking: boolean;
    providingAccess: boolean;
    synchronizeData: SynchronizeData;
    intervalSync: any;

    constructor(
        private activeRouter: ActivatedRoute,
        private fb: FormBuilder,
        private translateService: TranslateService,
        private fitbitStatusPipe: FitbitStatusPipe,
        private datePipe: DatePipe,
        private modalService: ModalService,
        private fitbitService: FitbitService,
        private toastService: ToastrService,
        private localStorageService: LocalStorageService
    ) {
        this.patientForm = new FormGroup({});
        this.synchronizeData = new SynchronizeData();
        this.promotedAccess = new EventEmitter<any>();
    }

    ngOnInit() {
        this.activeRouter.queryParams.subscribe(async params => {
            const code = params['code'];
            const error = params['error_description'];
            if (code || error) {
                this.providingAccess = true;
                try {
                    if (error) {
                        throw new Error('Not Authorized');
                    }
                    const result: OAuthUser = await this.fitbitService.getAccessToken(code);
                    this.localStorageService.setItem('fitbitUser', JSON.stringify(result));
                } catch (e) {
                    this.localStorageService.setItem('fitbitUser', JSON.stringify(e.message));
                } finally {
                    this.providingAccess = false;
                    window.close();
                }
            }
        })
    }

    async synchronize(): Promise<void> {
        this.synchronizing = true;
        try {
            const synchronizeData = await this.fitbitService.synchronize(this.patientId);
            this.synchronizeData = synchronizeData;
            this.modalService.open('synchronized');
        } catch (err) {
            if (err && err.status === 429) {
                this.toastService.error(this.translateService.instant('SECURITY.FORGOT.TOO-MANY-ATTEMPTS'))
            } else {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.COULD-NOT-SYNC'))
            }
        } finally {
            this.synchronizing = false;
        }
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

    async finalizeProvideAccess(fitbitUser: OAuthUser): Promise<void> {
        try {
            if (!fitbitUser || !fitbitUser.refresh_token || !fitbitUser.access_token) {
                throw new Error('Not Authorized')
            }
            await this.fitbitService.createUser(this.patientId, fitbitUser);
            this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PROVIDER-SUCCESSFULLY'));
            await this.synchronize();
            this.promotedAccess.emit();
        } catch (err) {
            throw err;
        } finally {
            this.localStorageService.removeItem('fitbitUser');
            this.providingAccess = false;
        }
    }

    async provideAccess(): Promise<any> {
        this.intervalSync = setInterval(async () => {
            try {
                const fitbitUser = JSON.parse(this.localStorageService.getItem('fitbitUser'));
                if (fitbitUser) {
                    clearInterval(this.intervalSync)
                    await this.finalizeProvideAccess(fitbitUser);
                }
            } catch (err) {
                if (err && err.message === 'Not Authorized') {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.ACCESS-DENIED'));
                } else {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.COULD-NOT-PROVIDER-ACCESS'));
                }
                clearInterval(this.intervalSync);
            }
        }, 1000)

        try {
            await this.fitbitService.getAuthorizeUrlCode();
        } catch (e) {
            this.toastService.error(this.translateService.instant('TOAST-MESSAGES.COULD-NOT-PROVIDER-ACCESS'));
            this.providingAccess = false;
            clearInterval(this.intervalSync)
        }

    }

    ngOnDestroy(): void {
        clearInterval(this.intervalSync)
    }
}
