import { Component } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { IUser, User } from 'app/models/users';
import { UserService } from '../services/users.service';
@Component({
  selector: 'app-caregiver',
  templateUrl: './caregiver.component.html',
  styleUrls: ['./caregiver.component.scss']
})
export class CaregiverComponent {
  private userEdit: IUser = new User();
  private caregivers: Array<IUser> = [];

  /* Controles de paginação */
  private page: number = 1;
  private limit: number = 5;
  private length: number;

  constructor(private userService: UserService, private toastr: ToastrService) {
    this.getAllCaregiver();
    /* Verificando a quantidade total de cuidadores cadastrados */
    this.calcLengthCaregivers();
  }

  getAllCaregiver() {
    this.userService.getAllCaregiver(this.page, this.limit)
      .then(caregivers => {
        this.caregivers = caregivers;
        this.calcLengthCaregivers();
      })
      .catch( error => {
        console.log('Erro ao buscar caregivers: ',error);
      });
  }

  createCaregiver(event) {
    this.userService.createCaregiver(event)
      .then(date => {
        if (date) {
          this.getAllCaregiver();
          this.toastr.info('Cuidador criado!');
        } else {
          this.toastr.error('Não foi possível criar cuidador!');
        }
      })
      .catch(error => {
        console.log('Erro ao criar caregivers: ', error);
        this.toastr.error('Não foi possível criar cuidador!');
      });
  }

  editCaregiver(event) {
    this.userService.updateUser(event)
      .then(date => {
        if (date) {
          this.getAllCaregiver();
          this.toastr.info('Cuidador atualizado!');
        } else {
          this.toastr.error('Não foi possível atualizar cuidador!');
        }
      })
      .catch(error => {
        console.log('Erro ao editar caregivers: ', error);
        this.toastr.error('Não foi possível atualizar cuidador!');
      });
  }

  cleanUserEdit() {
    this.userEdit = new User();
  }

  editUser(event) {
    this.userEdit = event;
  }

  paginationEvent(event){
    this.page = event.page;
    this.limit = event.limit;
    this.getAllCaregiver();
  }

  calcLengthCaregivers(){
    /** Verificando quantidade de cuidadores cadastrados */
    this.userService.getAllCaregiver()
      .then(caregivers => {
        this.length = caregivers.length;
      })
      .catch();
  }
}
