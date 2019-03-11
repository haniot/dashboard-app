import { Component, OnInit } from '@angular/core';
import { User } from 'app/models/users';
import { UserService } from '../services/users.service';

import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  private visibilityButtonSave: boolean = false;
  private disabledButtonEdit: boolean = false;
  private user: User;

  constructor(private userService: UserService,private toastr: ToastrService) {   }

  ngOnInit() {
    this.userService.getUserById(atob(localStorage.getItem('user')))
        .then(user => {
            if(user){
                this.user = user;
            }
        })
        .catch( error => {
            console.log(`| navbar.component.ts | Problemas na identificação do usuário. `, error);
        });
  }

  enabledEdit(){
    this.disabledButtonEdit = true;
    this.visibilityButtonSave = true;
  }

  onSubmit(form){
    const user: User = new User();
    user.name = form.value.name;
    user.email = form.value.email;
    user.id = atob(localStorage.getItem('user'));
    
    this.userService.updateUser(user)
      .then(() => {
        this.ngOnInit();
        this.toastr.success('Informações atualizadas!');
      })
      .catch((errorResponse: HttpErrorResponse) => {
        this.toastr.error('Não foi possível atualizar informações!');        
      });
  }
}
