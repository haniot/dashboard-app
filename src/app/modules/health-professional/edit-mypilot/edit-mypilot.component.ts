import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { PilotStudyService } from 'app/modules/pilot-study/services/pilot-study.service';

@Component({
    selector: 'app-edit-mypilot',
    templateUrl: './edit-mypilot.component.html',
    styleUrls: ['./edit-mypilot.component.scss']
})
export class EditMypilotComponent implements OnInit, OnChanges, OnDestroy {
    pilotStudyForm: FormGroup;
    professionalsForm: FormGroup;
    color = 'accent';
    checked = false;
    disabled = false;
    pilotStudyId: string;
    private subscriptions: Array<ISubscription>;

    constructor(
        private fb: FormBuilder,
        private pilotStudyService: PilotStudyService,
        private toastService: ToastrService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private location: Location,
        private translateService: TranslateService
    ) {
        this.subscriptions = new Array<ISubscription>();
    }

    ngOnInit() {
        this.subscriptions.push(this.activeRouter.paramMap.subscribe((params) => {
            this.pilotStudyId = params.get('pilotstudy_id');
            if (this.pilotStudyId) {
                this.createForm();
                this.getPilotStudy();
            }
        }));
        this.createForm();
        this.getPilotStudy();
    }

    getPilotStudy() {
        if (this.pilotStudyId) {
            this.pilotStudyService.getById(this.pilotStudyId)
                .then(res => {
                    this.pilotStudyForm.setValue(res);
                })
                .catch()
        }
    }

    createForm() {
        if (this.pilotStudyId) {
            this.pilotStudyForm = this.fb.group({
                id: [''],
                name: ['', Validators.required],
                start: ['', Validators.required],
                end: ['', Validators.required],
                health_professionals_id: [{ value: '', disabled: true }, Validators.required],
                is_active: [true, Validators.required]
            });
        }

        this.professionalsForm = this.fb.group({
            health_professionals_id_add: ['', Validators.required]
        });

        this.subscriptions.push(this.pilotStudyForm.get('start').valueChanges.subscribe(() => {
            this.pilotStudyForm.get('end').enable();
        }));
    }

    onSubmit() {
        const form = this.pilotStudyForm.getRawValue();

        this.pilotStudyService.update(form)
            .then(() => {
                this.toastService.info(this.translateService.instant('TOAST-MESSAGES.STUDY-UPDATED'));
            })
            .catch(error => {
                this.toastService.error(this.translateService.instant('TOAST-MESSAGES.STUDY-NOT-UPDATED'));
            });
    }

    onBack() {
        this.location.back();
    }

    ngOnChanges() {
        this.createForm();
        this.getPilotStudy();
    }

    ngOnDestroy(): void {
        /* cancel all subscribtions */
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

}
