import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '../../../../node_modules/@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { OnDestroy } from "@angular/core";
import { ISubscription } from "rxjs/Subscription";

import { AuthService } from 'app/auth/services/auth.service';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../models/users';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent{
  nome: string;
  email: string;
  users: Array<IUser> = [];
  errorCredentials = false;

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private authService: AuthService) {
    this.getAllUsers();
  }


  getAllUsers() {
    this.usersService.getAll().subscribe(
      (users) => {
        this.users = users;
      });
  }

  onSubmit(form: NgForm) {
    this.authService.register(form.value).subscribe(
      (resp) => {

      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401) {
          this.errorCredentials = true;
        }
      }
    );
  }

}
