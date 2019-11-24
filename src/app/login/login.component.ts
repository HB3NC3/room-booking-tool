import { Component, OnInit } from '@angular/core';
import {LoginService} from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  userName: string;
  password: string;
  invalid = false;
  loading = false;

  constructor(
    private loginService: LoginService,
    private router: Router) {
  }

  ngOnInit() {
  }

  sendLoginRequest() {
    this.loginService.login(this.userName, this.password).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/');
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
