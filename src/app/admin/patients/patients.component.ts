import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Users } from '../../models/users';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  users: Users
  columns = ['name', 'email', 'gender', 'height']

  constructor(public usersService: UsersService) {
    this.getAllUsers();
   }

  ngOnInit() {
  }

  getAllUsers() {
    this.usersService.getAll().subscribe((users) => {
      this.users = users.users;
      console.log(this.users)
    });
  }

}
