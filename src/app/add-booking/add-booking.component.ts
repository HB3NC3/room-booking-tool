import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Room, RoomService } from '../dashboard/room.service';
import { EventService, RoomEvent } from '../dashboard/event.service';
import { ErrorService } from '../error/error.service';
import { LoginService } from '../login/login.service';

export interface TimeOption {
  name: string,
  value: {
    hours: number;
    minutes: number;
    value: number;
  };
}

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.less']
})
export class AddBookingComponent implements OnInit {
  @Input() event: RoomEvent;
  @Output() onCloseDialog = new EventEmitter();
  startDate: Date = new Date();
  startTime: TimeOption;
  endDate: Date = new Date();
  endTime: TimeOption;

  startTimes: TimeOption[];
  endTimes: TimeOption[];
  name = 'Esemény1';
  description = '';
  isPrivate = true;
  availableRooms: Room[] = [];
  selectedRooms: Room[] = [];
  roomOnFocus: Room;

  constructor(
    private roomService: RoomService,
    private eventService: EventService,
    private errorService: ErrorService,
    public loginService: LoginService
  ) {
    this.roomService.rooms$.subscribe(rooms => {
      this.availableRooms = [...rooms];
      this.roomOnFocus = this.availableRooms[0];
    });
    this.startTimes = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 12; j++) {
        this.startTimes.push({
          name: `${i.toString().padStart(2, '0')}:${(j * 5).toString().padStart(2, '0')}`,
          value: {
            hours: i,
            minutes: j * 5,
            value: i * 60 + j * 5,
          }
        });
      }
    }
    this.endTimes = [...this.startTimes];
  }

  ngOnInit() {
    if (!!this.event) {
      this.name = this.event.name;
      this.description = this.event.description;
      this.isPrivate = this.event.isPrivate;
      this.event.roomList.forEach(room => this.addRoom(room));
      this.startDate = this.event.start;
      this.endDate = this.event.end;
      this.startTime = this.getTime(this.event.start);
      this.endTime = this.getTime(this.event.end);
    }

    if (!this.event) {
      const now = new Date();
      this.startTime = this.startTimes.find(x => x.value.value === (Math.ceil((now.getHours() * 60 + now.getMinutes()) / 5) * 5));
      this.startTime = this.startTime || this.startTimes[this.startTimes.length - 1];
      this.timeSelected();
      this.roomService.currentSelectedRoom$.subscribe(room => {
        this.addRoom(room);
      });
    }
  }

  addRoom(room: Room) {
    if (!room) {
      return;
    }
    const roomToAdd = this.availableRooms.find(x => x.id === room.id);
    if (roomToAdd) {
      this.selectedRooms.push(room);
      this.availableRooms = this.availableRooms.filter(x => x.id !== room.id);
      this.roomOnFocus = this.availableRooms[0];
    }
  }

  removeRoom(room: Room) {
    this.selectedRooms = this.selectedRooms.filter(x => x.id !== room.id);
    this.availableRooms.push(room);
    this.roomOnFocus = this.availableRooms[0];
  }

  sendCreateRequest() {
    if (!this.name) {
      this.errorService.notifyError('Hiányzó név');
      return;
    }
    if (!this.selectedRooms.length) {
      this.errorService.notifyError('Adj hozzá termet!');
      return;
    }

    const event: RoomEvent = {
      roomIds: this.selectedRooms.map(x => x.id),
      start: getDate(this.startDate, this.startTime),
      end: getDate(this.endDate, this.endTime),
      name: this.name,
      description: this.description,
      isPrivate: this.isPrivate
    } as RoomEvent;
    if (!!this.event) {
      event.id = this.event.id;
      this.eventService.modifyEvent(event).subscribe(() => {
          this.eventService.refresh();
          this.onCloseDialog.emit();
        },
        () => {
        }
      );
      return;
    }
    this.eventService.addEvent(event).subscribe(() => {
        this.eventService.refresh();
        this.onCloseDialog.emit();
      },
      () => {
      }
    );
  }

  timeSelected() {
    this.endTimes = this.startTimes.filter(x => x.value.value > this.startTime.value.value);
    const oneHourLater = this.startTimes.find(x => x.value.value === (this.startTime.value.value + 60));
    this.endTime = oneHourLater || this.startTimes[this.startTimes.length - 1];
  }

  sendDeleteRequest() {
    this.eventService.deleteEvent(this.event.id).subscribe(() => {
      this.eventService.refresh();
      this.onCloseDialog.emit();
    },
      () => {});
  }

  private getTime(date: Date): TimeOption {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return this.startTimes.find(time => time.value.value === Math.floor((hours * 60 + minutes) / 5) * 5);
  }

  onAddRoomClick(room: Room) {
    if (this.loginService.isGuest()) {
      return;
    }
    this.addRoom(room);
  }
}

function getDate(date: Date, time: TimeOption): Date {
  return new Date(date.setHours(time.value.hours, time.value.minutes));
}
