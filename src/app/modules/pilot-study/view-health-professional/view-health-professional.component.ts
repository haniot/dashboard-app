import { Component, Input, OnChanges } from '@angular/core';

import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { PilotStudyService } from '../services/pilot-study.service';
import { HealthProfessional } from 'app/modules/admin/models/users.models';

@Component({
  selector: 'view-health-professional',
  templateUrl: './view-health-professional.component.html',
  styleUrls: ['./view-health-professional.component.scss']
})
export class ViewHealthProfessionalComponent implements OnChanges {

  @Input() pilotstudyid: string;
  healthProfessionals: Array<HealthProfessional>;

  constructor(
    private modalService: ModalService,
    private pilotStudyService: PilotStudyService) { }

  ngOnChanges() {
    if (this.pilotstudyid) {
      this.pilotStudyService.getHealthProfessionalsByPilotStudyId(this.pilotstudyid)
        .then(healthprofessionals => {
          this.healthProfessionals = healthprofessionals;
        })
        .catch(error => {
          console.log('Não foi possivel buscar profissionais de saúde');
        });
    }
  }

}
