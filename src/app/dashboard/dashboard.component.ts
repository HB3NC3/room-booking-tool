import { AfterViewInit, Component, Injectable, ViewChild } from '@angular/core';
import { LoginService } from '../login/login.service';
import { RoomService } from './room.service';
import { NativeDateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { EventService, RoomEvent } from './event.service';
import { ErrorService } from '../error/error.service';

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
  currentSelectedRange: {start: string, end: string};
  eventEditing: RoomEvent;
  loginDialogOpen = false;
  manageRoomsDialogOpen = false;
  addBookingDialogOpen = false;
  registerDialogOpen = false;
  manageUsersDialogOpen = true;

  constructor(
    public loginService: LoginService,
    public roomService: RoomService,
    public eventService: EventService,
    public errorService: ErrorService
  ) {
    this.eventService.currentRange$.subscribe(range => {
      this.currentSelectedRange = {
        start: range.start.toLocaleString('hu-HU', {year: 'numeric', month: 'short', day: 'numeric'}),
        end: range.end.toLocaleString('hu-HU', {year: 'numeric', month: 'short', day: 'numeric'}),
      };
    });
    this.eventService.currentSelectedDate$.subscribe(date => {
      this.calendar && this.calendar._goToDateInView(date, 'month');
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
    this.closeManageUsersDialog();
    this.closeRegisterDialog();
  }

  openManageRoomsDialog() {
    this.manageRoomsDialogOpen = true;
    this.closeLoginDialog();
    this.closeAddBookingDialog();
    this.closeManageUsersDialog();
    this.closeRegisterDialog();
  }

  openAddBookingDialog() {
    this.addBookingDialogOpen = true;
    this.closeLoginDialog();
    this.closeManageRoomsDialog();
    this.closeManageUsersDialog();
    this.closeRegisterDialog();
  }

  openManageUsersDialog() {
    this.manageUsersDialogOpen = true;
    this.closeLoginDialog();
    this.closeManageRoomsDialog();
    this.closeRegisterDialog();
    this.closeAddBookingDialog();
  }

  openRegisterDialog() {
    this.registerDialogOpen = true;
    this.closeLoginDialog();
    this.closeManageRoomsDialog();
    this.closeManageUsersDialog();
    this.closeAddBookingDialog();
  }

  closeAddBookingDialog() {
    this.addBookingDialogOpen = false;
    this.eventEditing = null;
  }

  closeLoginDialog() {
    this.loginDialogOpen = false;
  }

  closeManageRoomsDialog() {
    this.manageRoomsDialogOpen = false;
  }

  closeManageUsersDialog() {
    this.manageUsersDialogOpen = false;
  }

  closeRegisterDialog() {
    this.registerDialogOpen = false;
  }

  editEvent(event: RoomEvent) {
    this.eventEditing = event;
    this.openAddBookingDialog();
  }
}
