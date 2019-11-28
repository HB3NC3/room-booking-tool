import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RoomService } from '../dashboard/room.service';
import { EventService, ONE_HOUR_MS, RoomEvent } from '../dashboard/event.service';

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
  @Output() onCloseDialog = new EventEmitter();
  private loading = false;
  private invalid = false;
  private event: RoomEvent = {
    name: 'New Event',
    description: '',
    start: new Date(),
    end: new Date(new Date().valueOf() + ONE_HOUR_MS),
    roomIds: []
  } as RoomEvent;
  selectedStartTime: TimeOption;
  startTimes: TimeOption[];
  selectedEndTime: TimeOption;
  endTimes: TimeOption[];
  startDate: Date = new Date();
  endDate: Date = new Date();
  name = 'Event name';
  description = '';
  isPrivate = true;
  constructor(
    private roomService: RoomService,
    private eventService: EventService
  ) {
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
    const now = new Date();
    this.selectedStartTime = this.startTimes.find(x => x.value.value === (Math.ceil((now.getHours() * 60 + now.getMinutes()) / 5) * 5));
    this.timeSelected();
  }


  sendCreateRequest() {
    if (!(this.event.name && this.event.roomIds.length)) {
      return;
    }
    this.eventService.addEvent(this.event).subscribe(success => {
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

  timeSelected() {
    this.endTimes = this.startTimes.filter(x => x.value.value > this.selectedStartTime.value.value);
    const oneHourLater = this.startTimes.find(x => x.value.value === (this.selectedStartTime.value.value + 60));
    this.selectedEndTime = oneHourLater || this.startTimes[this.startTimes.length - 1];
  }
}
