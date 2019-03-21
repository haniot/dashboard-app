import { Component } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { HealthProfessionalService } from '../services/health-professional.service';
import { IUser, HealthProfessional } from 'app/shared/shared-models/users.models';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';

@Component({
  selector: 'health-professionals',
  templateUrl: './health-professionals.component.html',
  styleUrls: ['./health-professionals.component.scss']
})
export class HealthProfessionalComponent {
  userEdit: IUser = new HealthProfessional();
  healthProfessionals: Array<IUser> = [];

  /* Controles de paginação */
  page: number = 1;
  limit: number = 5;
  length: number;

  constructor(
    private healthService: HealthProfessionalService,
    private toastr: ToastrService,
    private modalService: ModalService) {
    this.getAllHealthProfessionals();
    /* Buscando todos profissionais de saúde cadastrados para saber a quantidade total */
    this.getLengthHealthProfessionals();
  }

  getAllHealthProfessionals() {
    this.healthService.getAll(this.page, this.limit)
      .then(healthProfessionals => {
        this.healthProfessionals = healthProfessionals;
        this.getLengthHealthProfessionals();
      })
      .catch( error => {
        console.log('Erro ao buscar profissionais de saúde: ',error);
      });
  }

  createHealthProfessinal(event) {
    this.healthService.create(event)
      .then(date => {
        if (date) {
          this.getAllHealthProfessionals();
          this.toastr.info('Profissional de saúde criado!');
          this.modalService.close('modalUser');
        } else {
          this.toastr.error('Não foi possível criar profissional de saúde!');
        }
      })
      .catch(error => {
        console.log('Erro ao criar profissional de saúde: ', error);
        this.toastr.error('Não foi possível criar profissional de saúde!');
      });
  }

  editHealthProfessinal(event) {
    this.healthService.update(event)
      .then(date => {
        if (date) {
          this.getAllHealthProfessionals();
          this.toastr.info('Profissional de saúde atualizado!');
          this.modalService.close('modalUserEdit');          
        } else {
          this.toastr.error('Não foi possível atualizar profissional de saúde!');
        }
      })
      .catch(error => {
        this.modalService.actionNotExecuted('modalUserEdit',event);
        console.log('Erro ao atualizar profissional de saúde: ', error);
        this.toastr.error('Não foi possível atualizar profissional de saúde!');
      });
  }

  openModal() {
    this.modalService.open('modalUser');
    this.userEdit = new HealthProfessional();
  }

  editUser(event) {
    this.modalService.open('modalUserEdit');
    this.userEdit = event;
  }

  paginationEvent(event){
    this.page = event.page;
    this.limit = event.limit;
    this.getAllHealthProfessionals();
  }

  getLengthHealthProfessionals(){
    /** Verificando quantidade de cuidadores cadastrados */
    this.healthService.getAll()
      .then(caregivers => {
        this.length = caregivers.length;
      })
      .catch();
  }
}
