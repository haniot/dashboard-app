import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { AdminService } from '../services/admin.service';
import { IUser, Admin } from 'app/shared/shared-models/users.models';


@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent {
  private userEdit: IUser = new Admin();
  private admins: Array<IUser> = [];
  private errorCredentials = false;

  /* Controles de paginação */
  private page: number = 1;
  private limit: number = 5;
  private length: number;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService) {
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
        this.toastr.success('Administrator criado!');
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
        this.toastr.success('Administrator atualizado!');
      })
      .catch((errorResponse: HttpErrorResponse) => {
        this.toastr.error('Não foi possível atualizar administrador!');
          if (errorResponse.status === 401) {
            this.errorCredentials = true;
          }
        
      });
  }

  cleanUserEdit(){
    this.userEdit = new Admin();
  }

  editUser(event){
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
      .then(caregivers => {
        this.length = caregivers.length;
      })
      .catch();
  }
}
