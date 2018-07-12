import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/users';
import {ColumnsEasyTable} from '../../models/columns-easy-table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  users: User;
  selectedUser: any;

  openUserDetails: boolean = false;

  columns =  [
    { key: 'name', title: 'Nome' },
    { key: 'height', title: 'Altura(cm)' },
    { key: 'email', title: 'E-mail' },
    { key: 'nokey', title: 'Detalhes' }
  ]

  constructor(public usersService: UsersService) {
    this.getAllUsers();
  }
  ngOnInit() {

  }

  // postDiag(){
  //   this.usersService.postDiag().subscribe((res) =>{
  //       console.log(res)
  //   })
  // }

  getAllUsers() {
    this.usersService.getAll().subscribe((users) => {
      this.users = users.users;
      console.log(users);
    });
  }

  

  setLocalUser(event){
    //console.log("setLocalUser")
    this.selectedUser = event.user;
    this.showUserDetails();
    console.log(event.user);
  }

  showUserDetails(){
    this.openUserDetails = true;
  }

  hideUserDetails(){
    this.openUserDetails = false;
  }
}
