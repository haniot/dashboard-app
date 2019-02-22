import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/users';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  users: User;

  constructor(public usersService: UsersService) {
    this.getAllUsers();
   }

  ngOnInit() {
  }

  getAllUsers() {
    this.usersService.getAll().subscribe((users) => {
      this.users = users.users;
    });
  }

}
