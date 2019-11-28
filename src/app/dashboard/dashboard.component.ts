import { AfterViewInit, Component, Injectable, ViewChild } from '@angular/core';
import { LoginService } from '../login/login.service';
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
  manageRoomsDialogOpen = true;

  constructor(
    public loginService: LoginService,
    public roomService: RoomService
  ) {
    this.selectDate(new Date());
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

  openLoginDialog() {
    this.loginDialogOpen = true;
    this.closeManageRoomsDialog();
  }

  openManageRoomsDialog() {
    this.manageRoomsDialogOpen = true;
    this.closeLoginDialog();
  }

  closeLoginDialog() {
    this.loginDialogOpen = false;
  }

  closeManageRoomsDialog() {
    this.manageRoomsDialogOpen = false;
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
