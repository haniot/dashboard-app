import { Component, OnInit, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../admin/services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'access-settings',
  templateUrl: './access-settings.component.html',
  styleUrls: ['./access-settings.component.scss']
})
export class AccessSettingsComponent implements OnInit {

  @Input() userId: string;

  old_password: string;
  
  new_password: string;

  icon_password = 'visibility_off';

  typeInputPassword = 'password';

  icon_password_confirm = 'visibility_off';

  typeInputPassword_confirm = 'password';

  passwordIsValid: boolean;

  constructor(
    private userService: UserService,
    protected translate: TranslateService,
    private toastr: ToastrService,
  ) {
    this.passwordIsValid = true;
  }

  ngOnInit() {
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
        if (HttpError.error.code === 400 && HttpError.error.message == "Password does not match") {
          form.controls['old_password'].setErrors({ 'incorrect': true });
        }
      });
  }

  clickVisibilityPassword(): void {
    this.icon_password = this.icon_password === 'visibility_off' ? 'visibility' : 'visibility_off';
    if (this.icon_password === 'visibility_off') {
      this.typeInputPassword = 'password';
    } else {
      this.typeInputPassword = 'text';
    }
  }

  clickVisibilityPasswordConfirm(): void {
    this.icon_password_confirm = this.icon_password_confirm === 'visibility_off' ? 'visibility' : 'visibility_off';
    if (this.icon_password_confirm === 'visibility_off') {
      this.typeInputPassword_confirm = 'password';
    } else {
      this.typeInputPassword_confirm = 'text';
    }
  }

  validetorPassword(): void {
    const pass = '' + this.new_password;

    const len = pass.length;

    const letter = pass.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').length;
    const num = pass.replace(/[^\d]+/g, '').length;
    const sym = pass.replace(/[A-Za-z0-9_]/gi, '').length;


    if (len >= 6 && letter > 0 && num > 0 && sym > 0) {
      this.passwordIsValid = true;
    } else {
      this.passwordIsValid = false;
    }

  }

}
