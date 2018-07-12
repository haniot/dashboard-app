import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/users';
import {ColumnsEasyTable} from '../../models/columns-easy-table';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  users: User;
  //columns = ['name', 'email', 'gender', 'height']
  
  columns : ColumnsEasyTable[] =  [
    { key: 'name', title: 'Nome' },
    { key: 'height', title: 'Altura(cm)' },
    { key: 'email', title: 'E-mail' }
  ]

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
