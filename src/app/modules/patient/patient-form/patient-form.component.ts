import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {PatientService} from '../services/patient.service';
import {ToastrService} from 'ngx-toastr';
import {Gender} from '../models/patient';
import {Router, ActivatedRoute} from '@angular/router';
import {PilotStudy} from 'app/modules/pilot-study/models/pilot.study';
import {PilotStudyService} from 'app/modules/pilot-study/services/pilot-study.service';
import {Location} from '@angular/common';
import {PatientsComponent} from 'app/modules/evaluation/patients/patients.component';
import {AuthService} from 'app/security/auth/services/auth.service';

@Component({
    selector: 'patient-form',
    templateUrl: './patient-form.component.html',
    styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
    patientForm: FormGroup;
    optionsGender: Array<string> = Object.keys(Gender);
    listPilots: Array<PilotStudy>;

    patientId: string;
    pilotStudyId: string;

    matchPasswordStatus;

    matchPasswordTime;

    /* para o campo senha */
    icon_password = 'visibility_off';

    typeInputPassword = 'password';

    /* para o campo confirmação de senha */
    icon_password_confirm = 'visibility_off';

    typeInputPassword_confirm = 'password';

    constructor(
        private fb: FormBuilder,
        private patientService: PatientService,
        private pilotStudiesService: PilotStudyService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private location: Location,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.patientId = params.get('patientId');
            this.pilotStudyId = params.get('pilotstudy_id');
            this.createForm();
            this.loadPatientInForm();
            this.getAllPilotStudies();
        });
        this.createForm();
        this.getAllPilotStudies();
    }

    createForm() {
        this.patientForm = this.fb.group({
            id: [''],
            pilotstudy_id: [this.pilotStudyId, Validators.required],
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: [''],
            password_confirm: [''],
            gender: ['', Validators.required],
            birth_date: ['', Validators.required]
        });
    }

    loadPatientInForm() {
        if (this.patientId) {
            this.patientService.getById(this.patientId)
                .then(patient => {
                    patient.password = '';
                    patient.password_confirm = '';
                    this.verifyMatchPassword();
                    this.patientForm.setValue(patient);
                }).catch(errorResponse => {
                // console.error('Não foi possível buscar paciente!', errorResponse);
            })
        }
    }

    onSubimt() {
        const form = this.patientForm.getRawValue();
        form.birth_date = new Date(form.birth_date).toISOString().split('T')[0];
        if (!this.patientId) {
            this.patientService.create(form)
                .then(patient => {
                    this.patientForm.reset();
                    this.toastService.info('Paciente criado!');
                })
                .catch(errorResponse => {
                    this.toastService.error('Não foi possível criar paciente!');
                });
        } else {
            delete form.password;
            delete form.password_confirm;
            delete form.pilotstudy_id;
            this.patientService.update(form)
                .then(patient => {
                    this.toastService.info('Paciente atualizado!');
                })
                .catch(errorResponse => {
                    this.toastService.error('Não foi possível atualizar paciente!');
                });
        }
    }

    onBack() {
        this.location.back();
    }

    getAllPilotStudies() {
        if (this.authService.decodeToken().sub_type == 'admin') {

            this.pilotStudiesService.getAll()
                .then(pilots => {
                    this.listPilots = pilots;
                })
                .catch(errorResponse => {
                    // console.log('Não foi possivel buscar estudos pilotos!', errorResponse);
                });
        } else {
            const userId = atob(localStorage.getItem('user'));
            this.pilotStudiesService.getAllByUserId(userId)
                .then(pilots => {
                    this.listPilots = pilots;
                })
                .catch(errorResponse => {
                    // console.log('Não foi possivel buscar estudos pilotos!', errorResponse);
                });
        }
    }

    passwordMatch(): boolean {
        return this.patientForm.get('password').value == this.patientForm.get('password_confirm').value;
    }

    verifyMatchPassword() {
        clearTimeout(this.matchPasswordTime);

        this.matchPasswordTime = setTimeout(() => {
            this.matchPasswordStatus = this.passwordMatch();
        }, 200);
    }

    clickVisibilityPassword(): void {
        this.icon_password = this.icon_password === 'visibility_off' ? 'visibility' : 'visibility_off';
        if (this.icon_password === 'visibility_off') {
            this.typeInputPassword = 'password';
        } else {
            this.typeInputPassword = 'text';
        }
    }

    clickVisibilityPasswordConfirm(): void {
        this.icon_password_confirm = this.icon_password_confirm === 'visibility_off' ? 'visibility' : 'visibility_off';
        if (this.icon_password_confirm === 'visibility_off') {
            this.typeInputPassword_confirm = 'password';
        } else {
            this.typeInputPassword_confirm = 'text';
        }
    }
}
