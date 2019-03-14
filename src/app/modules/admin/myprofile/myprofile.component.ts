import { Component, OnInit, Input } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
import { HealthProfessionalService } from '../services/health-professional.service';
import { HealtArea } from 'app/shared/shared-models/users.models';
import { IUser } from 'app/shared/shared-models/users.models'

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  private visibilityButtonSave: boolean;
  private disabledButtonEdit: boolean;
  private user: IUser;
  private typeUser: string;// Admin or HealthProfessional
  private healthAreaOptions = Object.keys(HealtArea);

  constructor(
    private adminService: AdminService,
    private healthService: HealthProfessionalService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.adminService.getById(atob(localStorage.getItem('user')))
      .then(user => {
        if (user) {
          this.user = user;
          this.typeUser = 'Admin';
        } else {
          this.healthService.getById(atob(localStorage.getItem('user')))
            .then(user => {
              if (user) {
                this.user = user;
                this.typeUser = 'HealthProfessional'
              }
            })
            .catch(error => {
              console.log(`| navbar.component.ts | Problemas na identificação do usuário. `, error);
            });
        }

      })
      .catch(error => {
        console.log(`| navbar.component.ts | Problemas na identificação do usuário. `, error);
      });
  }

  enabledEdit(form) {
    this.disabledButtonEdit = true;
    this.visibilityButtonSave = true;
  }

  onSubmit(form) {
    if (this.typeUser == 'Admin') {
      const admin = form.value;
      admin.id = atob(localStorage.getItem('user'));
      this.adminService.update(admin)
        .then(() => {
          this.ngOnInit();
          this.toastr.success('Informações atualizadas!');
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
          this.ngOnInit();
          this.toastr.success('Informações atualizadas!');
          this.visibilityButtonSave = false;
          this.disabledButtonEdit = false;
        })
        .catch((errorResponse: HttpErrorResponse) => {
          this.toastr.error('Não foi possível atualizar informações!');
        });
    }
  }
}
