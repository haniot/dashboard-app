import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { IUser, User } from '../../models/users';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent {
  private userEdit: IUser = new User();
  private admins: Array<IUser> = [];
  private errorCredentials = false;

  constructor(
    private userService: UserService,
    private toastr: ToastrService) {
    this.getAllAdministrators();
  }


  getAllAdministrators() {
    this.userService.getAllAdministrator()
      .then( admins => {
        this.admins = admins;
      })
      .catch((errorResponse: HttpErrorResponse) => {        
        if (errorResponse.status === 401) {
          this.errorCredentials = true;
        }      
    });
      
  }

  createAdmin(event) {
    this.userService.createAdministrator(event)
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
    this.userService.updateUser(event)
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
    this.userEdit = new User();
  }

  editUser(event){
    this.userEdit = event;
  }
}
