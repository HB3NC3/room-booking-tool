import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  @Output() onCloseDialog = new EventEmitter();
  userName: string;
  password: string;
  invalid = false;
  loading = false;

  constructor(private loginService: LoginService) {}

  ngOnInit() {
  }

  sendLoginRequest() {
    this.loginService.login(this.userName, this.password).subscribe(success => {
      if (success) {
        this.onCloseDialog.emit();
        this.loading = false;
        return;
      } else if (success === null) {
        this.loading = true;
        return;
      }
      this.loading = false;
      this.invalid = true;
      return;
    });
  }
}
