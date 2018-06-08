import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Users } from '../../models/users';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  users: Users
  columns = ['name', 'email', 'gender', 'height']

  constructor(public usersService: UsersService) {
    this.getAllUsers();

   }

  ngOnInit() {
  //  this.postDiag();
  }

  // postDiag(){
  //   this.usersService.postDiag().subscribe((res) =>{
  //       console.log(res)
  //   })
  // }

  getAllUsers(){
    this.usersService.getAll().subscribe((users) => {
        this.users = users.users;
        console.log(this.users)
    });
  }
}
