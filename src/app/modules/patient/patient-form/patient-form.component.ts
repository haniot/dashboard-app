import {Component, OnInit, Input, OnChanges, AfterViewChecked} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {PatientService} from '../services/patient.service';
import {ToastrService} from 'ngx-toastr';
import {Gender, Patient} from '../models/patient';
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
export class PatientFormComponent implements OnInit, AfterViewChecked {
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

    min_birth_date: Date;

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
        this.min_birth_date = new Date();
    }

    ngOnInit() {
        this.calMinBirthDate();
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

    calMinBirthDate(): void {
        const today = new Date();
        this.min_birth_date.setFullYear(today.getFullYear() - 10, today.getMonth(), today.getDate());
    }

    createForm() {
        this.patientForm = this.fb.group({
            id: [''],
            pilotstudy_id: [this.pilotStudyId, Validators.required],
            name: ['', Validators.required],
            phone_number: [''],
            email: ['', Validators.compose([Validators.email])],
            password: [''],
            password_confirm: [''],
            gender: ['', Validators.required],
            birth_date: ['', Validators.required]
        });
    }

    setPatientInForm(patient: Patient) {
        this.patientForm = this.fb.group({
            id: [patient.id],
            pilotstudy_id: [patient.pilotstudy_id],
            name: [patient.name],
            phone_number: [patient.phone_number],
            email: [patient.email],
            password: [''],
            password_confirm: [''],
            gender: [patient.gender],
            birth_date: [patient.birth_date]
        });
    }

    loadPatientInForm() {
        if (this.patientId) {
            this.patientService.getById(this.patientId)
                .then(patient => {
                    patient.password = '';
                    patient.password_confirm = '';
                    this.verifyMatchPassword();
                    this.setPatientInForm(patient);
                    // this.patientForm.setValue(patient);
                }).catch(errorResponse => {
                // console.error('Não foi possível buscar paciente!', errorResponse);
            })
        }
    }

    onSubimt() {
        const form = this.patientForm.getRawValue();
        console.log(form)
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

    toApplyMaskPhoneNumber() {
        let number: string;
        number = this.patientForm.get('phone_number').value;

        number = number.replace(/\D/g, "");             //Remove tudo o que não é dígito
        number = number.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
        number = number.replace(/(\d)(\d{4})$/, "$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos

        this.patientForm.get('phone_number').patchValue(number);
    }

    ngAfterViewChecked(): void {
        this.calMinBirthDate();
    }
}
