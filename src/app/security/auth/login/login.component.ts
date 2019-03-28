import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import * as $ from 'jquery';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  f: FormGroup;
  errorCredentials = false;

  message: string

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    $('body').css('background-color', '#00a594')
    console.log()
    this.f = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  onSubmit() {
    this.errorCredentials = false;
    this.authService.login(this.f.value).subscribe(
      (resp) => {
        this.router.navigate(['']);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.errorCredentials = true;
          this.message = "Não Autorizado"
        }

        if (error.status === 404) {
          this.errorCredentials = true;
          this.message = "Usuário Inexistente"

        }
      }
    );
  };

}
