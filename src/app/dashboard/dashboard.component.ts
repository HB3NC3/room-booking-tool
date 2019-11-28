import { AfterViewInit, Component, Injectable, ViewChild } from '@angular/core';
import { LoginService } from '../login/login.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ONE_DAY_MS, Room, RoomService } from './room.service';
import { NativeDateAdapter } from '@angular/material/core';
import { createRange } from './calendar/calendar.component';
import { MatCalendar } from '@angular/material/datepicker';

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
export class DashboardComponent implements AfterViewInit {
  @ViewChild('leftDatePicker', {static: false}) calendar: MatCalendar<Date>;
  currentSelectedRoom: Room;
  currentSelectedDate: Date;
  currentSelectedRange: {start: string, end: string};
  loginDialogOpen = false;

  constructor(
    public loginService: LoginService,
    public roomService: RoomService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    this.selectDate(new Date());
    iconRegistry.addSvgIcon(
      'add_alert',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/add_alert-24px.svg'));
    iconRegistry.addSvgIcon(
      'arrow-left',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/keyboard_arrow_left-24px.svg'));
    iconRegistry.addSvgIcon(
      'arrow-right',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/keyboard_arrow_right-24px.svg'));
  }

  ngAfterViewInit() {

  }

  selectDate(date: Date) {
    this.currentSelectedDate = date;
    const range = createRange(date);
    this.currentSelectedRange = {
      start: range.start.toLocaleString('hu-HU', {year: 'numeric', month: 'short', day: 'numeric'}),
      end: range.end.toLocaleString('hu-HU', {year: 'numeric', month: 'short', day: 'numeric'}),
    };
    this.calendar && this.calendar._goToDateInView(date, 'month');
  }

  closeLoginDialog() {
    this.loginDialogOpen = false;
  }

  previousRange() {
    const date = new Date(this.currentSelectedDate.valueOf() - 7 * ONE_DAY_MS);
    this.selectDate(date);
  }

  nextRange() {
    const date = new Date(this.currentSelectedDate.valueOf() + 7 * ONE_DAY_MS);
    this.selectDate(date);
  }
}
