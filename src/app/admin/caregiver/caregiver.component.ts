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

  constructor(private userService: UserService, private toastr: ToastrService) {    
    this.getAllCaregiver();
  }


  getAllCaregiver() {
    this.userService.getAllCaregiver()
      .then(caregivers => {
        this.caregivers = caregivers;
      })
      .catch();
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
        console.log(error);
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
        console.log(error);
        this.toastr.error('Não foi possível atualizar cuidador!');
      });
  }

  cleanUserEdit(){
    this.userEdit = new User();
  }

  editUser(event){
    this.userEdit = event;
  }
}
