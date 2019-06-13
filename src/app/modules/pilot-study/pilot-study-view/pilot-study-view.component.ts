import {Component, OnInit, Input, OnChanges, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {ToastrService} from 'ngx-toastr';
import {ISubscription} from 'rxjs/Subscription';

import {HealthProfessional} from 'app/modules/admin/models/users';
import {PilotStudyService} from '../services/pilot-study.service';
import {PilotStudy} from "../models/pilot.study";
import {LocalStorageService} from "../../../shared/shared-services/localstorage.service";

@Component({
    selector: 'app-pilot-study-view',
    templateUrl: './pilot-study-view.component.html',
    styleUrls: ['./pilot-study-view.component.scss']
})
export class PilotStudyViewComponent implements OnInit, OnChanges, OnDestroy {

    pilotStudyForm: FormGroup;
    professionalsForm: FormGroup;

    listProf: Array<HealthProfessional> = [];

    color = 'accent';
    checked = false;
    disabled = false;

    @Input() pilotStudyId: string;

    pilotStudy: PilotStudy;

    userHealthArea: string;

    private subscriptions: Array<ISubscription>;

    constructor(
        private fb: FormBuilder,
        private pilotStudyService: PilotStudyService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private _location: Location,
        private localStorageService: LocalStorageService
    ) {
        this.pilotStudy = new PilotStudy();
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.loaduserHealthArea();
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.pilotStudyId = params.get('pilotStudyId');
            if (this.pilotStudyId) {
                this.createForm();
                this.getPilotStudy();
            }
        }));

        this.createForm();
        this.getPilotStudy();
    }

    loaduserHealthArea(): void {
        this.userHealthArea = this.localStorageService.getItem('health_area');
    }

    getPilotStudy() {
        if (this.pilotStudyId) {
            this.pilotStudyService.getById(this.pilotStudyId)
                .then(res => {
                    this.pilotStudyForm.setValue(res);
                    this.pilotStudy = res;
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
        } else {// Caso seja a tela de inserção
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

    ngOnDestroy(): void {
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
