import { Component, EventEmitter, Output } from "@angular/core";
import { combineLatest } from 'rxjs';
import { EventService, RoomEvent } from '../event.service';

interface time {
  display: string;
  hours: number;
  minutes: number;
}

interface EventEntry {
  id: string;
  name: string;
  range: string
  start: number;
  height: number;
}

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.less"]
})
export class CalendarComponent {
  @Output() eventClicked = new EventEmitter<RoomEvent>();
  private events: RoomEvent[];
  headers: number[] = [];
  hours: time[];
  eventsByDay: EventEntry[][] = [[],[],[],[],[],[],[]];
  days: string[] = [
    "Hétfő",
    "Kedd",
    "Szerda",
    "Csütörtök",
    "Péntek",
    "Szombat",
    "Vasárnap"
  ];

  constructor(
    public eventService: EventService
  ) {
    this.hours = Array(24)
      .fill(1)
      .map((val, idx) => {
        return {
          display: `${idx
            .toString()
            .padStart(2, "0")}:${(0).toString().padStart(2, "0")}`,
          hours: idx,
          minutes: 0
        };
      });
    this.eventService.currentRange$.subscribe(range => {
      this.headers = getHeaderNumbers(range.start);
    });
    combineLatest(
      this.eventService.currentRange$,
      this.eventService.events$
    ).subscribe(([currentRange, allEvents]) => {
      this.events = allEvents;
      this.eventsByDay = [[],[],[],[],[],[],[]];
      allEvents.forEach(event => {
        const eventStartDay = (event.start.getDay() + 6) % 7;
        const eventEndDay = (event.end.getDay() + 6) % 7;
        if (event.start.valueOf() < currentRange.start.valueOf()) {
          if (event.end.valueOf() > currentRange.end.valueOf()) {
            [...Array(7).keys()].forEach(x => {
              this.eventsByDay[x].push({
                id: event.id,
                start: 0,
                height: 24,
                name: x ? '' : event.name,
                range: x ? '' : getRange(event)
              })
            })
          } else if (event.end.valueOf() > currentRange.start.valueOf() && event.end.valueOf() < currentRange.end.valueOf()) {
            // range elejetol az event vegeig szinezni
            [...Array(eventEndDay).keys()].forEach(x => {
              this.eventsByDay[x].push({
                id: event.id,
                start: 0,
                height: 24,
                name: x ? '' : event.name,
                range: x ? '' : getRange(event)
              })
            });
            this.eventsByDay[eventEndDay].push({
              id: event.id,
              start: 0,
              height: getNumberFormDate(event.end),
              name: '', //event.name,
              range: '' //getRange(event)
            });

          }
        } else if ( event.end.valueOf() > currentRange.end.valueOf()) {
          if (event.start.valueOf() < currentRange.end.valueOf()) {
            this.eventsByDay[eventStartDay].push({
              id: event.id,
              start: getNumberFormDate(event.start),
              height: 24 - getNumberFormDate(event.start),
              name: event.name,
              range: getRange(event)
            });
            [...Array(6 - eventStartDay).keys()].forEach(x => {
              this.eventsByDay[x + eventStartDay + 1].push({
                id: event.id,
                start: 0,
                height: 24,
                name: '', //event.name,
                range: '' // getRange(event)
              })
            })
            // eevent start tol range vegeig
          }
        } else {
          // event a rangen belul van
          if (eventStartDay === eventEndDay) {
            //egy napon belul van
            this.eventsByDay[eventStartDay].push({
              id: event.id,
              start: getNumberFormDate(event.start),
              height: getNumberFormDate(event.end) - getNumberFormDate(event.start),
              name: event.name,
              range: getRange(event)
            });
            return;
          }
          this.eventsByDay[eventStartDay].push({
            id: event.id,
            start: getNumberFormDate(event.start),
            height: 24 - getNumberFormDate(event.start),
            name: event.name,
            range: getRange(event)
          });

          this.eventsByDay[eventEndDay].push({
            id: event.id,
            start: 0,
            height: getNumberFormDate(event.end),
            name: '', //event.name,
            range: '', //getRange(event)
          });
          [...Array(eventEndDay - 1 - eventStartDay).keys()].forEach(x => {
            this.eventsByDay[x + eventStartDay + 1].push({
              id: event.id,
              start: 0,
              height: 24,
              name: '', // event.name,
              range: '' // getRange(event)
            })
          })
          //tobb napon keresztul megy
        }
      });
    })
  }

  onClick(eventEntry: EventEntry) {
    const event = this.events.find(event => event.id === eventEntry.id);
    this.eventClicked.emit(event);
  }
}

function getHeaderNumbers(date: Date): number[] {
  const value = date.valueOf();
  const values: number[] = [];
  [...Array(7).keys()].forEach( v => {
    values.push(new Date(value + v * 24 * 60 * 60 * 1000).getDate());
  });
  return values;
}

function getRange(event: RoomEvent) {
  return event.start.toLocaleString(undefined, {hour: 'numeric', minute: 'numeric', hour12: false}) + ' - '
    + event.end.toLocaleString(undefined, {hour: 'numeric', minute: 'numeric', hour12: false})

}

function getNumberFormDate(date: Date): number {
  return date.getHours() + date.getMinutes() / 60
}
