import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { Validators, FormBuilder, FormGroup } from '../../../../node_modules/@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {


  f: FormGroup;
  errorCredentials = false;
  redirect_link;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

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
    this.errorCredentials = false;
    this.authService.changePassowrd(this.f.value, this.redirect_link).subscribe(
      (resp) => {
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 400) {
          this.errorCredentials = true;
          console.log(errorResponse)
        }
      }
    );
  }

}
