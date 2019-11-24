import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor(
    public loginService: LoginService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
    ) {
    iconRegistry.addSvgIcon(
      'add_alert',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/add_alert-24px.svg'));
  }

  ngOnInit() {
  }

}
