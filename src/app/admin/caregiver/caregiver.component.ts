import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { NgForm } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { IUser } from 'app/models/users';
import { CaregiverService } from './caregiver.service';

@Component({
  selector: 'app-caregiver',
  templateUrl: './caregiver.component.html',
  styleUrls: ['./caregiver.component.scss']
})
export class CaregiverComponent {

  caregivers: Array<IUser> = [];

  constructor(
    private caregiverService: CaregiverService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.getAllUsers();
  }


  getAllUsers() {
    this.caregiverService.getAll()
      .then(caregivers => {
        this.caregivers = caregivers;
      })
      .catch();
  }

  onSubmit(form: NgForm) {
    this.caregiverService.create(form.value)
      .then(date => {
        if (date) {
          this.getAllUsers();
          form.reset();
          this.toastr.info('Caregiver created!', 'Sucess');
        } else {
          this.toastr.error('Unable to create caregiver!', 'Error');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  removeCaregiver(id: string){
    console.log('Remover caregiver id: ',id);
  }

}
