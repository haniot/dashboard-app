import { Component, OnInit } from '@angular/core';

import { User } from 'app/models/users';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-caregiver',
  templateUrl: './caregiver.component.html',
  styleUrls: ['./caregiver.component.scss']
})
export class CaregiverComponent{
  caregivers: Array<User> = [];

  constructor(private usersService: UsersService) {
    this.getAllUsers();
   }


  getAllUsers() {
    this.usersService.getAll().subscribe((users) => {
      console.log(users);
      this.caregivers = users;
    });
  }

}
