import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {PilotStudyService} from 'app/modules/pilot-study/services/pilot-study.service';
import {PilotStudy} from "../../pilot-study/models/pilot.study";

@Component({
    selector: 'app-patient-component',
    templateUrl: './patient-component.component.html',
    styleUrls: ['./patient-component.component.scss']
})
export class PatientComponentComponent implements OnInit {
    pilotStudyId: string;
    subtitle: string;

    listPilots: Array<PilotStudy>;

    constructor(
        private router: Router,
        private activeRouter: ActivatedRoute,
        private pilotStudyService: PilotStudyService) {
        this.listPilots = new Array<PilotStudy>();
    }

    ngOnInit() {
        this.activeRouter.paramMap.subscribe((params) => {
            this.pilotStudyId = params.get('pilotstudy_id');
            this.router.navigate(['patients', this.pilotStudyId]);
        });
        this.buildSubtitle();
        this.getAllPilotStudies();
    }

    newPatient() {
        this.router.navigate(['patients', this.pilotStudyId, 'new']);
    }

    buildSubtitle() {
        this.pilotStudyService.getById(this.pilotStudyId)
            .then(pilot => {
                this.subtitle = 'Estudo selecionado: ' + pilot.name;
            })
            .catch(errorResponse => {
                console.log('Não foi possível buscar estudo piloto!', errorResponse);
            });
    }

    selectPilotStudy(): void {
        localStorage.setItem('pilotstudi_id', this.pilotStudyId);
    }

    getAllPilotStudies(): void {
        const userId = atob(localStorage.getItem('user'));

        this.pilotStudyService.getAllByUserId(userId)
            .then(studies => {
                this.listPilots = studies;
            })
            .catch(error => {
                console.log('Erro ao buscar pilot-studies: ', error);
            });
    }

    onBack() {
        this.router.navigate(['patients']);
    }

}
