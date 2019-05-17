import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {


  f: FormGroup;
  errorCredentials = false;
  redirect_link;

  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    $('body').css('background-color', '#00a594')
    console.log()
    this.f = this.formBuilder.group({
      old_password: [null, [Validators.required]],
      new_password: [null, [Validators.required]]
    });


    this.route
      .queryParams
      .subscribe(params => {
        this.redirect_link = params['redirect_link'];
      });
  }

  onSubmit() {
    this.loading = true;
    this.errorCredentials = false;
    this.authService.changePassowrd(this.f.value, this.redirect_link).subscribe(
      (resp) => {
        this.loading = false;
        this.toastr.info("Senha alterada com sucesso!");
      },
      (errorResponse: HttpErrorResponse) => {
        // console.log(errorResponse)        
        if (errorResponse.status == 400 && errorResponse.error.code == 400 && errorResponse.error.message == 'Password does not match!') {
          this.toastr.error("Senha antiga informada incorreta!");
        } else {
          this.toastr.error("Não foi possível mudar a senha!");
        }
        this.loading = false;
      }
    );
  }

}
