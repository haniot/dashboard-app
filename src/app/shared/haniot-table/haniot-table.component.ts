import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'app/auth/services/auth.service';


import { UserService } from 'app/admin/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { IUser } from 'app/models/users';

@Component({
  selector: 'haniot-table',
  templateUrl: './haniot-table.component.html',
  styleUrls: ['./haniot-table.component.scss']
})
export class HaniotTableComponent {
  @Input() list: Array<IUser>;
  @Output() onremove = new EventEmitter();
  @Input() userType: number;
  @Output() onedit = new EventEmitter();
  private search: string;
  private searchTime;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService) { }

  verifySameUser(user: any): boolean {
    return user.id == this.authService.decodeToken().sub;
  }

  removeUser(id: string) {
    this.userService.removeUser(id)
      .then(() => {
        this.onremove.emit();
        this.toastr.info('User successfully removed!', 'Sucess');
      })
      .catch(error => {
        this.toastr.error('Unable to remove user!', 'Error');
      });

  }

  editUser(id: string) {
    this.userService.getUserById(id)
      .then((user) => {
        this.onedit.emit(user);
      })
      .catch(error => {
        this.toastr.error('Unable to edit user!', 'Error');
      });

  }

  searchOnSubmit() {
    clearInterval(this.searchTime);
    this.searchTime = setTimeout(() => {
      this.getAllUsers().
        then(users => {
          this.list = users;
          this.list = this.list.filter((user) => {
            return user.name.search(this.search) != -1;
          });
        })
        .catch();
    }, 200);

  }
  
  getAllUsers(): Promise<Array<IUser>> {
    switch(this.userType){
      case 1:
        return this.userService.getAllAdministrator();
      case 2:
        return this.userService.getAllCaregiver();
    }
    
  }
}
