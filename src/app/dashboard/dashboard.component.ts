import { Component, Injectable, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Room, RoomService } from './room.service';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  getFirstDayOfWeek(): number {
    return 1;
  }


}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  currentSelectedRoom: Room;
  currentSelectedDate: Date = new Date();

  constructor(
    public loginService: LoginService,
    public roomService: RoomService,
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
