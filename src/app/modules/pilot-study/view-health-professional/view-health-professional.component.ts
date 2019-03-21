import { Component, Input, OnChanges } from '@angular/core';
import { HealthProfessional } from 'app/shared/shared-models/users.models';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { PilotStudyService } from '../services/pilot-study.service';

@Component({
  selector: 'view-health-professional',
  templateUrl: './view-health-professional.component.html',
  styleUrls: ['./view-health-professional.component.scss']
})
export class ViewHealthProfessionalComponent implements OnChanges{

  @Input() pilotstudyId: string;
  healthProfessionals: Array<HealthProfessional>;

  constructor(
    private modalService: ModalService,
    private pilotStudyService: PilotStudyService) {}

  open(){
    this.modalService.open('healthProfessionals');
  }

  ngOnChanges(){
    this.pilotStudyService.getHealthProfessionalsByPilotStudyId(this.pilotstudyId)
      .then( healthprofessionals => {
        this.healthProfessionals = healthprofessionals;
      })
      .catch( error => {
        console.log('Não foi possivel buscar profissionais de saúde');
      });
  }

}
