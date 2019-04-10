import { Component, OnInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
import { HealthProfessionalService } from '../services/health-professional.service';
import { IUser, HealtArea } from '../models/users.models';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  userId: string;

  visibilityButtonSave: boolean;
  disabledButtonEdit: boolean;
  user: IUser;
  typeUser: string;// Admin or HealthProfessional
  healthAreaOptions = Object.keys(HealtArea);

  email: string;
  password: string;

  old_password: string;
  new_password: string;

  constructor(
    private adminService: AdminService,
    private healthService: HealthProfessionalService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userId = atob(localStorage.getItem('user'));
    this.typeUser = localStorage.getItem('typeUser');
    if (this.typeUser == 'Admin') {
      this.adminService.getById(this.userId)
        .then(admin => this.user = admin)
        .catch(HttpError => {
          console.log('Não foi possível carregar usuário logado!', HttpError);
        });
    } else if (this.typeUser == 'HealthProfessional') {
      this.healthService.getById(this.userId)
        .then(healthprofessional => this.user = healthprofessional)
        .catch(HttpError => {
          console.log('Não foi possível carregar usuário logado!', HttpError);
        });
    } else {
      this.userService.getTypeUserAndSetLocalStorage(this.userId);
      this.getUser();
    }
  }

  enabledEdit() {
    this.disabledButtonEdit = true;
    this.visibilityButtonSave = true;
  }

  onSubmit(form) {
    if (this.typeUser == 'Admin') {
      const admin = form.value;
      admin.id = atob(localStorage.getItem('user'));
      this.adminService.update(admin)
        .then(() => {
          this.getUser();
          this.toastr.info('Informações atualizadas!');
          this.visibilityButtonSave = false;
          this.disabledButtonEdit = false;
        })
        .catch((errorResponse: HttpErrorResponse) => {
          this.toastr.error('Não foi possível atualizar informações!');
        });
    } else if (this.typeUser == 'HealthProfessional') {
      const healthProfessional = form.value;
      healthProfessional.id = atob(localStorage.getItem('user'));
      this.healthService.update(healthProfessional)
        .then(() => {
          this.getUser();
          this.toastr.info('Informações atualizadas!');
          this.visibilityButtonSave = false;
          this.disabledButtonEdit = false;
        })
        .catch((errorResponse: HttpErrorResponse) => {
          this.toastr.error('Não foi possível atualizar informações!');
        });
    }
  }
  onChangePassword(form) {
    this.userService.changePassword(this.userId, form.value)
      .then(() => {
        this.toastr.info('Senha modificada com sucesso!');
        form.reset();
      })
      .catch(HttpError => {
        console.log('Não foi possível mudar a senha!', HttpError);
        this.toastr.error('Não foi posível mudar sua senha!');
        if (HttpError.error.code == 400 && HttpError.error.message == "Password does not match") {
          form.controls['old_password'].setErrors({ 'incorrect': true });
        }
      });
  }
}
