import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { PilotStudyService } from '../services/pilot.study.service';
import { Patient } from '../../patient/models/patient'
import { GenericUser } from '../../../shared/shared.models/generic.user'
import { PatientService } from '../../patient/services/patient.service'
import { HealthProfessional } from '../../admin/models/health.professional'
import { HealthProfessionalService } from '../../admin/services/health.professional.service'
import { AuthService } from '../../../security/auth/services/auth.service'
import { ModalService } from '../../../shared/shared.components/haniot.modal/service/modal.service'
import { SelectPilotStudyService } from '../../../shared/shared.components/select.pilotstudy/service/select.pilot.study.service'
import { LocalStorageService } from '../../../shared/shared.services/local.storage.service'

@Component({
    selector: 'pilot-study-form',
    templateUrl: './pilot.study.form.component.html',
    styleUrls: ['./pilot.study.form.component.scss']
})
export class PilotStudyFormComponent implements OnInit, OnChanges, OnDestroy {
    @Input() pilotStudyId: string;
    pilotStudyForm: FormGroup;
    professionalsForm: FormGroup;
    listProf: Array<HealthProfessional> = [];
    professionalsNotAssociated: Array<HealthProfessional> = [];
    professionalsNotAssociatedIsEmpty: boolean;
    professionalsAssociated: Array<HealthProfessional> = [];
    listOfProfessionalIsEmpty: boolean
    color = 'accent';
    checked = false;
    disabled = false;
    typeUserLogged: string;
    patientForm: FormGroup;
    listPatients: Array<Patient> = [];
    patientsNotAssociated: Array<Patient> = [];
    patientsNotAssociatedIsEmpty: boolean;
    patientsAssociated: Array<Patient> = [];
    listOfPatientsIsEmpty: boolean;
    cacheIdPatientRemove: string;
    cacheIdProfessionalRemove: string;
    removing: boolean;
    private subscriptions: Array<ISubscription>;

    constructor(
        private fb: FormBuilder,
        private pilotStudyService: PilotStudyService,
        private selectPilotService: SelectPilotStudyService,
        private healthService: HealthProfessionalService,
        private patientService: PatientService,
        private localStorageService: LocalStorageService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private _location: Location,
        private authService: AuthService,
        private translateService: TranslateService,
        private modalService: ModalService
    ) {
        this.professionalsAssociated = new Array<HealthProfessional>();
        this.professionalsNotAssociated = new Array<HealthProfessional>();
        this.patientsAssociated = new Array<Patient>();
        this.patientsNotAssociated = new Array<Patient>();
        this.listProf = new Array<HealthProfessional>();
        this.listPatients = new Array<Patient>();
        this.subscriptions = new Array<ISubscription>();
        this.cacheIdProfessionalRemove = '';
        this.cacheIdPatientRemove = '';
        this.removing = false;
        this.professionalsNotAssociatedIsEmpty = false;
        this.patientsNotAssociatedIsEmpty = false;
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe(async (params) => {
            this.pilotStudyId = params.get('pilotStudyId');
            this.typeUserLogged = this.authService.decodeToken().sub_type;
            if (this.pilotStudyId) {
                this.createForm();
                const pilot = await this.getPilotStudy();
                if (pilot) {
                    if (this.typeUserLogged && this.typeUserLogged === 'admin') {
                        await this.getListProfessionals();
                        await this.getListPatients();
                    }
                    this.loadProfessionalsAssociated();
                    this.loadPatientsAssociated()
                }
            }

        }));
        if (!this.pilotStudyId) {
            this.typeUserLogged = this.authService.decodeToken().sub_type;
            this.createForm();
            if (this.typeUserLogged && this.typeUserLogged === 'admin') {
                this.getListProfessionals();
                this.getListPatients();
            }
        }
    }

    getPilotStudy(): Promise<any> {
        if (this.pilotStudyId) {
            return this.pilotStudyService.getById(this.pilotStudyId)
                .then(res => {
                    this.pilotStudyForm.setValue(res);
                    return res;
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-FIND'));
                })
        } else {
            return Promise.reject();
        }

    }

    createForm() {
        if (this.pilotStudyId) {
            this.pilotStudyForm = this.fb.group({
                id: [''],
                created_at: [''],
                name: ['', Validators.required],
                location: ['', Validators.required],
                start: ['', Validators.required],
                end: ['', Validators.required],
                total_health_professionals: ['0'],
                total_patients: ['0'],
                is_active: [true, Validators.required]
            });
        } else {
            this.pilotStudyForm = this.fb.group({
                id: [''],
                created_at: [''],
                name: ['', Validators.required],
                location: [''],
                start: ['', Validators.required],
                end: [{ value: '', disabled: true }, Validators.required],
                total_health_professionals: ['0'],
                total_patients: ['0'],
                is_active: [true, Validators.required]
            });
        }
        this.professionalsForm = this.fb.group({
            health_professionals_id_add: ['', Validators.required]
        });

        this.patientForm = this.fb.group({
            patients_id_add: ['', Validators.required]
        });

        this.subscriptions.push(this.pilotStudyForm.get('start').valueChanges.subscribe(val => {
            this.pilotStudyForm.get('end').enable();
        }));
    }

    onSubmit() {
        const form = this.pilotStudyForm.getRawValue();
        if (!this.pilotStudyId) {
            this.pilotStudyService.create(form)
                .then(pilotStudy => {
                    this.pilotStudyForm.reset();
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.STUDY-CREATED'));
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-CREATED'));
                });
        } else {
            this.pilotStudyService.update(form)
                .then(() => {
                    this.toastService.info(this.translateService.instant('TOAST-MESSAGES.STUDY-UPDATED'));
                })
                .catch(() => {
                    this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-UPDATED'));
                });
        }
        /*If the study being edited is the same study selected by the user,
        * you must fire the event so that the component showing the selected study is updated.
        * */
        const userId = this.localStorageService.getItem('user');
        const pilotSelectedId = this.localStorageService.getItem(userId);
        if (this.pilotStudyId === pilotSelectedId) {
            this.selectPilotService.pilotStudyHasUpdated(this.pilotStudyId);
        }
    }

    ngOnChanges() {
        this.createForm();
        this.getPilotStudy();
    }

    onBack() {
        this._location.back();
    }

    getListProfessionals(): Promise<any> {
        return this.healthService.getAll()
            .then(httpResponse => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.listProf = httpResponse.body;
                }
                this.listOfProfessionalIsEmpty = this.listProf.length === 0;
            })
            .catch();
    }

    getListPatients(): Promise<any> {
        return this.patientService.getAll()
            .then(httpResponse => {
                if (httpResponse.body && httpResponse.body.length) {
                    this.listPatients = httpResponse.body;
                }
                this.listOfPatientsIsEmpty = this.listPatients.length === 0;
            })
            .catch();
    }

    dissociateHealthProfessional() {
        this.closeConfirmationRemoveProfessional();
        this.removing = true;
        this.pilotStudyService.dissociateHealthProfessionalsFromPilotStudy(this.pilotStudyId, this.cacheIdProfessionalRemove)
            .then(() => {
                this.loadProfessionalsAssociated();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONAL-REMOVED'));
                this.removing = false;
            })
            .catch(() => {
                this.removing = false;
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONAL-NOT-REMOVED'));
            });
    }

    addProfessionalInStudy() {
        const healthProfessional_id_add = this.professionalsForm.get('health_professionals_id_add').value;
        this.pilotStudyService.addHealthProfessionalsToPilotStudy(this.pilotStudyId, healthProfessional_id_add)
            .then(() => {
                this.professionalsForm.reset();
                this.loadProfessionalsAssociated();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONAL-ADD'));
            })
            .catch(() => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.HEALTHPROFESSIONAL-NOT-ADD'));
            });
    }

    loadProfessionalsAssociated() {
        if (this.pilotStudyId) {
            this.professionalsAssociated = [];
            this.pilotStudyService.getHealthProfessionalsByPilotStudyId(this.pilotStudyId)
                .then(httpResponse => {
                    this.professionalsAssociated = httpResponse.body
                    this.listOfProfessionalIsEmpty = this.professionalsAssociated.length === 0;
                    this.loadProfessionalsNotAssociated();
                })
                .catch();
        }
    }

    loadProfessionalsNotAssociated() {
        this.professionalsNotAssociated = [];
        this.professionalsNotAssociated = this.listProf
            .filter(professional => !this.search(this.professionalsAssociated, professional));
        this.professionalsNotAssociatedIsEmpty = !(this.professionalsNotAssociated && this.professionalsNotAssociated.length)

        if (this.professionalsNotAssociatedIsEmpty) {
            this.professionalsNotAssociated = undefined
        }

    }

    dissociatePatient() {
        this.closeConfirmationRemovePatient()
        this.removing = true;
        this.pilotStudyService.dissociatePatientFromPilotStudy(this.pilotStudyId, this.cacheIdPatientRemove)
            .then(() => {
                this.loadPatientsAssociated();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PATIENT-REMOVED'));
                this.removing = false;
            })
            .catch(() => {
                this.removing = false;
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-REMOVED'));
            });
    }

    addPatientInStudy() {
        const patietId = this.patientForm.get('patients_id_add').value;
        this.pilotStudyService.addPatientToPilotStudy(this.pilotStudyId, patietId)
            .then(() => {
                this.patientForm.reset();
                this.loadPatientsAssociated();
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.PATIENT-ADD'));
            })
            .catch(() => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.PATIENT-NOT-ADD'));
            });
    }

    loadPatientsAssociated() {
        if (this.pilotStudyId) {
            this.patientsAssociated = [];
            this.pilotStudyService.getPatientsByPilotStudy(this.pilotStudyId)
                .then(httpResponse => {
                    this.patientsAssociated = httpResponse.body;
                    this.listOfPatientsIsEmpty = this.patientsAssociated.length === 0;
                    this.loadPatientsNotAssociated();
                })
                .catch();
        }
    }

    loadPatientsNotAssociated() {
        this.patientsNotAssociated = [];
        this.patientsNotAssociated = this.listPatients
            .filter(patient => !this.search(this.patientsAssociated, patient));
        this.patientsNotAssociatedIsEmpty = !(this.patientsNotAssociated && this.patientsNotAssociated.length);
        if (this.patientsNotAssociatedIsEmpty) {
            this.patientsNotAssociated = undefined;
        }
    }

    openConfirmationRemovePatient(patietnId: string): void {
        this.cacheIdPatientRemove = patietnId;
        this.modalService.open('confirmRemovePatient');
    }

    closeConfirmationRemovePatient(): void {
        this.modalService.close('confirmRemovePatient');
    }

    closeAndCleanConfirmationRemovePatient(): void {
        this.cacheIdPatientRemove = '';
        this.closeConfirmationRemovePatient();
    }

    openConfirmationRemoveProfessional(professionalID: string): void {
        this.cacheIdProfessionalRemove = professionalID;
        this.modalService.open('confirmRemoveProfessional');
    }

    closeConfirmationRemoveProfessional(): void {
        this.modalService.close('confirmRemoveProfessional');
    }

    closeAndCleanConfirmationRemoveProfessional(): void {
        this.cacheIdProfessionalRemove = '';
        this.closeConfirmationRemoveProfessional();
    }

    private search(list: Array<GenericUser>, item: GenericUser): boolean {
        return !!list.find(element => {
            return element.id === item.id;
        });
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
