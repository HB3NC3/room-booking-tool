import { AfterViewInit, Component, Injectable, ViewChild } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Room, RoomService } from './room.service';
import { NativeDateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { EventService } from './event.service';

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
  manageRoomsDialogOpen = false;
  addBookingDialogOpen = true;

  constructor(
    public loginService: LoginService,
    public roomService: RoomService,
    public eventService: EventService
  ) {
    this.eventService.currentRange$.subscribe(range => {
      this.currentSelectedRange = {
        start: range.start.toLocaleString('hu-HU', {year: 'numeric', month: 'short', day: 'numeric'}),
        end: range.end.toLocaleString('hu-HU', {year: 'numeric', month: 'short', day: 'numeric'}),
      };
    });
    this.eventService.currentSelectedDate$.subscribe(date => {
      this.calendar && this.calendar._goToDateInView(date, 'month');
      this.currentSelectedDate = date;
    })
  }

  ngAfterViewInit() {

  }

  selectDate(date: Date) {
    this.eventService.selectDate(date);
  }

  openLoginDialog() {
    this.loginDialogOpen = true;
    this.closeManageRoomsDialog();
    this.closeAddBookingDialog();
  }

  openManageRoomsDialog() {
    this.manageRoomsDialogOpen = true;
    this.closeLoginDialog();
    this.closeAddBookingDialog();
  }

  openAddBookingDialog() {
    this.addBookingDialogOpen = true;
    this.closeLoginDialog();
    this.closeManageRoomsDialog()
  }

  closeAddBookingDialog() {
    this.addBookingDialogOpen = false;
  }

  closeLoginDialog() {
    this.loginDialogOpen = false;
  }

  closeManageRoomsDialog() {
    this.manageRoomsDialogOpen = false;
  }

  openManageUsersDialog() {

  }

  openRegisterDialog() {

  }
}
