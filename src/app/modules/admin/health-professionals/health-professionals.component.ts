import {AfterViewChecked, Component} from '@angular/core';

import {ToastrService} from 'ngx-toastr';

import {HealthProfessionalService} from '../services/health-professional.service';
import {ModalService} from 'app/shared/shared-components/haniot-modal/service/modal.service';
import {HealthProfessional, IUser} from '../models/users';
import {LoadingService} from 'app/shared/shared-components/loading-component/service/loading.service';

@Component({
  selector: 'health-professionals',
  templateUrl: './health-professionals.component.html',
  styleUrls: ['./health-professionals.component.scss']
})
export class HealthProfessionalComponent implements AfterViewChecked {
  userEdit: IUser = new HealthProfessional();
  healthProfessionals: Array<IUser> = [];

  /* Controles de paginação */
  page = 1;
  limit = 5;
  length: number;

  search: string;

  constructor(
    private healthService: HealthProfessionalService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private loadinService: LoadingService) {
    this.getAllHealthProfessionals();
    /* Buscando todos profissionais de saúde cadastrados para saber a quantidade total, o length é utilizado na paginação */
    this.getLengthHealthProfessionals();
  }

  getAllHealthProfessionals() {
    this.healthService.getAll(this.page, this.limit, this.search)
      .then(healthProfessionals => {
        this.healthProfessionals = healthProfessionals;
        this.getLengthHealthProfessionals();
        this.loadinService.close();
      })
      .catch(errorResponse => {
        this.toastr.error('Não foi possível listar profissional de saúde!');
        // console.log('Erro ao buscar profissionais de saúde: ',errorResponse);
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
          this.toastr.error('Email já cadastrado', 'Não foi possível criar profissional de saúde!');
          this.modalService.actionNotExecuted('modalUser', event);
        }
      })
      .catch(errorResponse => {
        if (errorResponse.status === 409 &&
          errorResponse.error.code === 409 &&
          errorResponse.error.message === 'A registration with the same unique data already exists!') {
          this.toastr.error('Email já cadastrado');
        } else {
          this.toastr.error('Não foi possível criar profissional de saúde!');
        }
        this.modalService.actionNotExecuted('modalUser', event, errorResponse.error);
        // console.log('Não foi possível criar profissional de saúde!',errorResponse);
      });
  }

  editHealthProfessinal(healthProfessional) {
    this.healthService.update(healthProfessional)
      .then(date => {
        if (date) {
          this.getAllHealthProfessionals();
          this.toastr.info('Profissional de saúde atualizado!');
          this.modalService.close('modalUserEdit');
        } else {
          this.toastr.error('Não foi possível atualizar profissional de saúde!');
          this.modalService.actionNotExecuted('modalUserEdit', healthProfessional);
        }
      })
      .catch(errorResponse => {
        if (errorResponse.status === 409 &&
          errorResponse.error.code === 409 &&
          errorResponse.error.message === 'A registration with the same unique data already exists!') {
          this.toastr.error('Email já cadastrado');
        } else {
          this.toastr.error('Não foi possível atualizar profissional de saúde!');
        }
        this.modalService.actionNotExecuted('modalUserEdit', healthProfessional);
        // console.log('Não foi possível atualizar profissional de saúde!', errorResponse);
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

  paginationEvent(event) {
    this.page = event.page;
    this.limit = event.limit;
    this.search = event.search;
    this.getAllHealthProfessionals();
  }

  getLengthHealthProfessionals() {
    /** Verificando quantidade de profissionais cadastrados */
    this.healthService.getAll()
      .then(caregivers => {
        this.length = caregivers.length;
      })
      .catch(errorResponse => {
        // console.log('Não foi possível buscar todos os profissionais!', errorResponse);
      });
  }

  ngAfterViewChecked() {
    this.loadinService.close();
  }

}
