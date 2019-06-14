import {Component, OnInit, Input, OnChanges, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {ToastrService} from 'ngx-toastr';
import {ISubscription} from 'rxjs/Subscription';

import {PilotStudyService} from '../services/pilot-study.service';
import {HealthProfessionalService} from 'app/modules/admin/services/health-professional.service';
import {HealthProfessional} from 'app/modules/admin/models/users';
import {AuthService} from 'app/security/auth/services/auth.service';

@Component({
    selector: 'pilot-study-form',
    templateUrl: './pilot-study-form.component.html',
    styleUrls: ['./pilot-study-form.component.scss']
})
export class PilotStudyFormComponent implements OnInit, OnChanges, OnDestroy {

    pilotStudyForm: FormGroup;
    professionalsForm: FormGroup;

    listProf: Array<HealthProfessional> = [];
    professinalsNotAssociated: Array<HealthProfessional> = [];
    professinalsAssociated: Array<HealthProfessional> = [];

    multiSelectProfissionais: Array<any> = new Array<any>();
    multiSelectProfissionaisSelected: Array<any> = new Array<any>();

    color = 'accent';
    checked = false;
    disabled = false;

    @Input() pilotStudyId: string;
    healthprofessionalId: string;

    typeUserLogado: string;

    private subscriptions: Array<ISubscription>;

    constructor(
        private fb: FormBuilder,
        private pilotStudyService: PilotStudyService,
        private healthService: HealthProfessionalService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private _location: Location,
        private authService: AuthService
    ) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.typeUserLogado = this.authService.decodeToken().sub_type;
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {

            this.pilotStudyId = params.get('pilotStudyId');

            if (this.pilotStudyId) {
                this.createForm();
                this.getPilotStudy();
            }

            if (this.typeUserLogado && this.typeUserLogado == 'admin') {
                this.loadProfessinalsAssociated();
                this.getListProfissonals();
            }
        }));

        this.createForm();
        this.getPilotStudy();


        if (this.typeUserLogado && this.typeUserLogado == 'admin') {
            this.getListProfissonals();
        }
    }

    getPilotStudy() {
        if (this.pilotStudyId) {
            this.pilotStudyService.getById(this.pilotStudyId)
                .then(res => {
                    this.pilotStudyForm.setValue(res);
                }).catch(error => {
                this.toastService.error('Não foi possível buscar estudo piloto!');
                // console.error('Não foi possível buscar estudo piloto!', error);
            })
        }
    }

    createForm() {
        if (this.pilotStudyId) {// Caso seja a tela de edição
            this.pilotStudyForm = this.fb.group({
                id: [''],
                name: ['', Validators.required],
                location: ['', Validators.required],
                start: ['', Validators.required],
                end: ['', Validators.required],
                health_professionals_id: ['', Validators.required],
                is_active: [true, Validators.required],
            });
        } else {//Caso seja a tela de inserção
            this.pilotStudyForm = this.fb.group({
                id: [''],
                name: ['', Validators.required],
                location: [''],
                start: ['', Validators.required],
                end: [{value: '', disabled: true}, Validators.required],
                health_professionals_id: ['', Validators.required],
                is_active: [true, Validators.required],
            });
        }
        this.professionalsForm = this.fb.group({
            health_professionals_id_add: ['', Validators.required],
        });

        this.subscriptions.push(this.pilotStudyForm.get('start').valueChanges.subscribe(val => {
            this.pilotStudyForm.get('end').enable();
        }));
    }

    onSubimt() {
        const form = this.pilotStudyForm.getRawValue();
        if (!this.pilotStudyId) {
            this.pilotStudyService.create(form)
                .then(pilotStudy => {
                    this.pilotStudyForm.reset();
                    this.toastService.info('Estudo Piloto criado!');
                })
                .catch(error => {
                    this.toastService.error('Não foi possível criar estudo piloto!');
                });
        } else {
            this.pilotStudyService.update(form)
                .then(() => {
                    this.toastService.info('Estudo Piloto atualizado!');
                })
                .catch(error => {
                    this.toastService.error('Não foi possível atualizar estudo piloto!');
                    // console.log('Não foi possível atualizar estudo!', error);
                });
        }
    }

    ngOnChanges() {// Caso o componente receba o id ele carrega o form com o estudo piloto correspondente.
        this.createForm();
        this.getPilotStudy();
    }

    onBack() {
        this._location.back();
    }

    getListProfissonals(): Promise<any> {
        return this.healthService.getAll()
            .then(healthProfessionals => {
                this.listProf = healthProfessionals;
            })
            .catch(error => {
                // console.log('Erro ao carregar lista de profisionais!', error);
            });
    }

    dissociateHealthProfessional(health_professionals_id: string) {
        this.pilotStudyService.dissociateHealthProfessionalsFromPilotStudy(this.pilotStudyId, health_professionals_id)
            .then(() => {
                this.loadProfessinalsAssociated();
                this.toastService.info("Profissional removido com sucesso!");
            })
            .catch(HttpError => {
                this.toastService.error('Não foi possível remover professional!');
                // console.log('Não foi possível adicionar remover!', HttpError);
            });
    }

    addProfessionalInStudy() {
        const healthProfessional_id_add = this.professionalsForm.get('health_professionals_id_add').value;
        this.pilotStudyService.addHealthProfessionalsToPilotStudy(this.pilotStudyId, healthProfessional_id_add)
            .then((healthProfessional) => {
                this.professionalsForm.reset();
                this.loadProfessinalsAssociated();
                this.toastService.info("Profissional adicionado com sucesso!");
            })
            .catch(HttpError => {
                this.toastService.error('Não foi possível adicionar professional!');
                // console.log('Não foi possível adicionar professional!', HttpError);
            });
    }

    loadProfessinalsAssociated() {
        if (this.pilotStudyId) {
            this.pilotStudyService.getHealthProfessionalsByPilotStudyId(this.pilotStudyId)
                .then(professionals => {
                    this.professinalsAssociated = professionals
                    this.loadProfessinalsNotAssociated();
                })
                .catch(HttpError => {
                    // console.log('Não foi possível carregar profissionais associados ao estudo!', HttpError)
                });
        }
    }

    loadProfessinalsNotAssociated() {
        this.getListProfissonals()
            .then(() => {
                this.professinalsNotAssociated = [];
                this.professinalsNotAssociated = this.listProf
                    .filter(professional => !this.searchProfessional(this.professinalsAssociated, professional));
            });


    }

    private searchProfessional(listProf: Array<HealthProfessional>, professional: HealthProfessional): boolean {
        return listProf.find(prof => {
            return prof.id == professional.id;
        }) ? true : false;
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnDestroy(): void {
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
