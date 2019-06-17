import { Component, AfterViewInit, OnInit, AfterViewChecked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { AdminService } from '../services/admin.service';
import { ModalService } from 'app/shared/shared-components/haniot-modal/service/modal.service';
import { IUser, Admin } from '../models/users';
import { LoadingService } from 'app/shared/shared-components/loading-component/service/loading.service';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent implements AfterViewChecked {
  userEdit: IUser = new Admin();
  admins: Array<IUser> = [];
  errorCredentials = false;

  /* Controles de paginação */
  page: number = 1;
  limit: number = 5;
  length: number;

  search: string;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private loadinService: LoadingService) {
    this.getAllAdministrators();
    /* Verificando a quantidade total de cuidadores cadastrados */
    this.calcLengthAdministrators();
  }

  getAllAdministrators() {
    this.adminService.getAll(this.page, this.limit, this.search)
      .then(admins => {
        this.admins = admins;
        this.calcLengthAdministrators();
        this.loadinService.close();
      })
      .catch((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401) {
          this.errorCredentials = true;
        }
        this.toastr.error('Não foi possível listar administrador!');
        // console.log('Não foi possível listar administrador!',errorResponse);
      });

  }

  createAdmin(event) {
    this.adminService.create(event)
      .then(() => {
        this.getAllAdministrators();
        this.toastr.info('Administrator criado!');
        this.modalService.close('modalUser');
        this.modalService.close('modalLoading');
      })
      .catch((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 409 &&
          errorResponse.error.code == 409 &&
          errorResponse.error.message == 'A registration with the same unique data already exists!') {
          this.toastr.error('Email já cadastrado');
        } else {
          this.toastr.error('Não foi possível criar administrador!');
        }
        this.modalService.actionNotExecuted('modalUser', event, errorResponse.error);
        if (errorResponse.status === 401) {
          this.errorCredentials = true;
        }
        // console.log('Não foi possível criar administrador!',errorResponse);
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
        if (errorResponse.status == 409 &&
          errorResponse.error.code == 409 &&
          errorResponse.error.message == 'A registration with the same unique data already exists!') {
          this.toastr.error('Email já cadastrado');
        } else {
          this.toastr.error('Não foi possível atualizar administrador!');
        }
        this.modalService.actionNotExecuted('modalUserEdit', event, errorResponse.error);
        if (errorResponse.status === 401) {
          this.errorCredentials = true;
        }
        // console.log('Não foi possível atualizar administrador!', errorResponse);
      });
  }

  openModal() {
    this.modalService.open('modalUser');
    this.userEdit = new Admin();
  }

  editUser(event) {
    this.modalService.open('modalUserEdit');
    this.userEdit = event;
  }

  paginationEvent(event) {
    this.page = event.page;
    this.limit = event.limit;
    this.search = event.search;
    this.getAllAdministrators();
  }

  calcLengthAdministrators() {
    /** Verificando quantidade de administradores cadastrados */
    this.adminService.getAll()
      .then(admins => {
        this.length = admins.length;
      })
      .catch(errorResponse => {
        // console.log('Error ao buscar administradores!', errorResponse);
      });
  }

  ngAfterViewChecked() {
    this.loadinService.close();
  }

}
