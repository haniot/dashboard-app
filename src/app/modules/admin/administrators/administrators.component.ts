import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { AdminService } from '../services/admin.service';
import { IUser, Admin } from 'app/shared/shared-models/users.models';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';


@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent {
  userEdit: IUser = new Admin();
  admins: Array<IUser> = [];
  errorCredentials = false;

  /* Controles de paginação */
  page: number = 1;
  limit: number = 5;
  length: number;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private modalService: ModalService) {
    this.getAllAdministrators();
    /* Verificando a quantidade total de cuidadores cadastrados */
    this.calcLengthAdministrators();
  }


  getAllAdministrators() {
    this.adminService.getAll(this.page, this.limit)
      .then( admins => {
        this.admins = admins;
        this.calcLengthAdministrators();
      })
      .catch((errorResponse: HttpErrorResponse) => {        
        if (errorResponse.status === 401) {
          this.errorCredentials = true;
        }      
    });
      
  }

  createAdmin(event) {
    this.adminService.create(event)
      .then(() => {
        this.getAllAdministrators();
        this.toastr.info('Administrator criado!');
        this.modalService.close('modalUser');
      })
      .catch((errorResponse: HttpErrorResponse) => {
        this.toastr.error('Não foi possível criar administrador!');
          if (errorResponse.status === 401) {
            this.errorCredentials = true;
          }
        
      });
  }

  editAdmin(event) {
    this.adminService.update(event)
      .then(() => {
        this.getAllAdministrators();
        this.toastr.info('Administrator atualizado!');
        this.modalService.close('modalUserEdit');
      })
      .catch((errorResponse: HttpErrorResponse) => {
        this.modalService.actionNotExecuted('modalUserEdit',event);
        this.toastr.error('Não foi possível atualizar administrador!');
          if (errorResponse.status === 401) {
            this.errorCredentials = true;
          }
        
      });
  }

  openModal(){
    this.modalService.open('modalUser');
    this.userEdit = new Admin();
  }

  editUser(event){
    this.modalService.open('modalUserEdit');
    this.userEdit = event;
  }

  paginationEvent(event){
    this.page = event.page;
    this.limit = event.limit;
    this.getAllAdministrators();
  }

  calcLengthAdministrators(){
    /** Verificando quantidade de cuidadores cadastrados */
    this.adminService.getAll()
      .then(healthprofessionals => {
        this.length = healthprofessionals.length;
      })
      .catch(error => {
        console.log('Error ao buscar profissionais de saúde!', error);
      });
  }
}
