import {Component, OnInit, AfterViewInit, AfterViewChecked} from '@angular/core';

import * as $ from 'jquery';
import {DashboardService} from '../services/dashboard.service';
import {AuthService} from 'app/security/auth/services/auth.service';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';
import {ToastrService} from "ngx-toastr";
import {Unit} from "../models/unit";
import {GraphService} from "../../../shared/shared-services/graph.service";
import {PilotStudy} from "../../pilot-study/models/pilot.study";
import {ModalService} from "../../../shared/shared-components/haniot-modal/service/modal.service";
import {SelectPilotStudyService} from "../../../shared/shared-components/select-pilotstudy/service/select-pilot-study.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewChecked {

    userId: string;

    patientsTotal: number;
    studiesTotal: number;
    measurementsTotal: number;
    evaluationsTotal: number;

    listPacientsAndWeigth: Array<Unit>;

    listPilots: Array<PilotStudy>;

    pilotStudyId: string;

    constructor(
        private dashboardService: DashboardService,
        private authService: AuthService,
        private loadinService: LoadingService,
        private toastService: ToastrService,
        private selectPilotService: SelectPilotStudyService
    ) {
        this.patientsTotal = 0;
        this.measurementsTotal = 0;
        this.evaluationsTotal = 0;
        this.listPacientsAndWeigth = new Array<Unit>();
        this.listPilots = new Array<PilotStudy>();
        this.pilotStudyId = '';
    }


    ngOnInit() {
        $('body').css('background-color', '#ececec');
        this.loadUserId();
        this.load();
        const pilotstudy_id = localStorage.getItem('pilotstudi_id');
        if (pilotstudy_id && pilotstudy_id !== '') {
            this.pilotStudyId = pilotstudy_id;
        } else {
            this.selectPilotService.open();
        }
    }

    load() {
        if (!this.userId || this.userId === '') {
            this.loadUserId();
            this.load();
        }

        this.dashboardService.getInfoByUser(this.userId)
            .then((response: { studiesTotal: number, patientsTotal: number, measurementsTotal: number, evaluationsTotal: number }) => {
                if (response) {
                    this.studiesTotal = response.studiesTotal;
                    this.patientsTotal = response.patientsTotal;
                    this.measurementsTotal = response.measurementsTotal;
                    this.evaluationsTotal = response.evaluationsTotal;
                    this.listPilots = this.dashboardService.getListStudy();
                    const pilotstudy_id = atob(localStorage.getItem('pilotstudi_id'));
                    if (pilotstudy_id) {
                        this.updateGraphWeigth();
                    }
                }
            })
            .catch(error => {
                this.toastService.error('Não foi possível carregar informações!')
            });
    }

    loadUserId() {
        this.userId = this.authService.decodeToken().sub;
    }

    selectPilotStudy(): void {
        localStorage.setItem('pilotstudi_id', this.pilotStudyId);
        this.updateGraphWeigth();
    }

    updateGraphWeigth() {
        const pilotstudy_id = localStorage.getItem('pilotstudi_id');

        if (pilotstudy_id && pilotstudy_id !== '') {
            this.dashboardService.getPatientsAndWeigth(pilotstudy_id)
                .then(list => {
                    this.listPacientsAndWeigth = list;
                })
                .catch(err => {
                    console.log('Não foi possível carregar informações de peso dos pacientes');
                });
        } else {
            /**
             * FIXME: Abrir página para selecionar um estudo
             */
        }
    }

    ngAfterViewChecked() {
        this.loadinService.close();
    }


}

