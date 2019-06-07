import { Component, OnInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
import { HealthProfessionalService } from '../services/health-professional.service';
import { IUser, HealtArea } from '../models/users';
import { UserService } from '../services/users.service';
import { AuthService } from 'app/security/auth/services/auth.service';

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
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.typeUser = this.authService.decodeToken().sub_type;
    this.getUser();
  }

  getUser() {
    this.userId = atob(localStorage.getItem('user'));
    switch (this.typeUser) {
      case 'admin':
        this.adminService.getById(this.userId)
          .then(admin => this.user = admin)
          .catch(HttpError => {
            // console.log('Não foi possível carregar usuário logado!', HttpError);
          });
        break;
      case 'health_professional':
        this.healthService.getById(this.userId)
          .then(healthprofessional => this.user = healthprofessional)
          .catch(HttpError => {
            // console.log('Não foi possível carregar usuário logado!', HttpError);
          });
        break;
    }

  }

  enabledEdit() {
    this.disabledButtonEdit = true;
    this.visibilityButtonSave = true;
  }

  onSubmit(form) {
    switch (this.typeUser) {
      case 'admin':
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
        break;
      case 'health_professional':
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
        break;
    }
  }

  onChangePassword(form) {
    this.userService.changePassword(this.userId, form.value)
      .then(() => {
        this.toastr.info('Senha modificada com sucesso!');
        form.reset();
      })
      .catch(HttpError => {
        // console.log('Não foi possível mudar a senha!', HttpError);
        this.toastr.error('Não foi posível mudar sua senha!');
        if (HttpError.error.code == 400 && HttpError.error.message == "Password does not match") {
          form.controls['old_password'].setErrors({ 'incorrect': true });
        }
      });
  }
}
