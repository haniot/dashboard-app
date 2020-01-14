import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { ModalService } from '../../../shared/shared.components/modal/service/modal.service'
import { LoadingService } from '../../../shared/shared.components/loading.component/service/loading.service'
import { Router } from '@angular/router'
import { UserService } from '../../admin/services/users.service'
import { AuthService } from '../../../security/auth/services/auth.service'
import { ToastrService } from 'ngx-toastr'

@Component({
    selector: 'delete-account',
    templateUrl: './delete.account.component.html',
    styleUrls: ['./delete.account.component.scss']
})
export class DeleteAccountComponent {
    @Input() userId

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private modalService: ModalService,
        private loadingService: LoadingService,
        private router: Router) {
    }

    openModalDeleteAccount(): void {
        this.modalService.open('modalConfirmation');
    }

    deleteAccount(): void {
        this.closeModalDeleteAccount();
        this.loadingService.open();
        this.userService.removeUser(this.userId)
            .then(() => {
                // this.loadingService.close();
                this.authService.logout();
                this.router.navigate(['/'])
                this.loadingService.close();
            })
            .catch(() => {
                this.loadingService.close();
                this.toastr.error(this.translateService.instant('TOAST-MESSAGES.ACCOUNT-NOT-DELETED'));
            })
    }

    closeModalDeleteAccount(): void {
        this.modalService.close('modalConfirmation');
    }

}
