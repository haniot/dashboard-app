import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormGroup } from '@angular/forms'

import { TranslateService } from '@ngx-translate/core'
import { ToastrService } from 'ngx-toastr';

import { ExternalService, OAuthUser, SynchronizeData } from '../../../modules/patient/models/external.service';
import { FitbitStatusPipe } from '../pipes/fitbit.status.pipe';
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service';
import { FitbitService } from '../services/fitbit.service';
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'
import { ActivatedRoute, Router } from '@angular/router'

export enum ChangeExternalService {
    providedAccess = 'providedAccess',
    revokedAccess = 'revokedAccess'
}

@Component({
    selector: 'external-service',
    templateUrl: './external.service.component.html',
    styleUrls: ['./external.service.component.scss']
})
export class ExternalServiceComponent implements OnInit, OnDestroy {
    @Input() patientId: string;
    @Input() externalServices: ExternalService[];
    @Output() change: EventEmitter<ChangeExternalService>;
    @Input() loading: boolean;
    patientForm: FormGroup;
    synchronizing: boolean;
    revoking: boolean;
    providingAccess: boolean;
    synchronizeData: SynchronizeData;
    intervalSync: any;

    constructor(
        private activeRouter: ActivatedRoute,
        private translateService: TranslateService,
        private fitbitStatusPipe: FitbitStatusPipe,
        private datePipe: DatePipe,
        private modalService: ModalService,
        private fitbitService: FitbitService,
        private toastService: ToastrService,
        private localStorageService: LocalStorageService,
        private router: Router
    ) {
        this.patientForm = new FormGroup({});
        this.synchronizeData = new SynchronizeData();
        this.change = new EventEmitter<ChangeExternalService>();
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
                    this.redirectToEscapePage();
                } finally {
                    this.providingAccess = false;
                    window.close();
                }
            }

            if (!code && !error && !this.externalServices && !this.loading) {
                this.redirectToEscapePage();
            }
        })
    }

    redirectToEscapePage(): void {
        this.providingAccess = true;
        this.router.navigate(['/oauth/invalid']);
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
        this.modalService.open('confirmRevoke');
    }

    async revoke(): Promise<void> {
        this.closeModalRevoke();
        this.revoking = true;
        try {
            await this.fitbitService.revoke(this.patientId)
            this.modalService.close('modalConfirmation');
            this.toastService.info(this.translateService.instant('TOAST-MESSAGES.REVOKED-SUCCESSFULLY'));
            this.change.emit(ChangeExternalService.revokedAccess);
        } catch (e) {
            this.toastService.error(this.translateService.instant('TOAST-MESSAGES.COULD-NOT-REVOKE'));
        } finally {
            this.revoking = false;
        }
    }

    closeModalSynchronized(): void {
        this.modalService.close('synchronized');
    }

    closeModalRevoke(): void {
        this.modalService.close('confirmRevoke');
    }

    async finalizeProvideAccess(fitbitUser: OAuthUser): Promise<void> {
        try {
            if (!fitbitUser || !fitbitUser.refresh_token || !fitbitUser.access_token) {
                throw new Error('Not Authorized')
            }
            await this.fitbitService.createUser(this.patientId, fitbitUser);
            this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PROVIDER-SUCCESSFULLY'));
            await this.synchronize();
            this.change.emit(ChangeExternalService.providedAccess);
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
