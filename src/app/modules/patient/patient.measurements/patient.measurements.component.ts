import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'
import { PatientService } from '../services/patient.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'patient-measurements',
    templateUrl: './patient.measurements.component.html',
    styleUrls: ['../view.habits/view.habits.component.scss']
})
export class PatientMeasurementsComponent implements OnInit {
    patientId: string;

    constructor(
        private router: Router,
        private activeRouter: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private patientService: PatientService,
        private toastService: ToastrService,
        private translateService: TranslateService
    ) {
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.getPatient();
        });
    }

    getPatient(): void {
        const patientLocal = JSON.parse(this.localStorageService.getItem('patientSelected'));
        if (this.patientId !== patientLocal.id) {
            this.patientService.getById(this.patientId)
                .then(patient => {
                    this.localStorageService.selectedPatient(patient);
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-FIND'));
                });
        } else {
            this.localStorageService.selectedPatient(patientLocal);
        }
    }

}
