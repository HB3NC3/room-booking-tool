import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from './user.service';
import { ErrorService } from '../error/error.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.less']
})
export class RegisterFormComponent {
  @Output() onCloseDialog = new EventEmitter();
  userName = '';
  password = '';
  passwordAgain = '';

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private loginService: LoginService
  ) { }

  onSubmit() {
    if (!this.userName) {
      this.errorService.notifyError('Adj meg egy felhasználónevet!');
      return;
    }
    if (this.password !== this.passwordAgain) {
      this.errorService.notifyError('A jelszavak nem egyeznek meg!');
      return;
    }
    if (!this.password || !this.passwordAgain) {
      this.errorService.notifyError('Add meg a jelszót!');
      return;
    }
    this.userService.register(this.userName, this.password).subscribe(() => {
      this.loginService.login(this.userName, this.password).subscribe(() => {}, () => {});
      this.onCloseDialog.emit();
    },
      () => {});
  }
}
