import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { RoomEvent, RoomService } from "../room.service";
import { BehaviorSubject, combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';

interface time {
  display: string;
  hours: number;
  minutes: number;
}

interface EventEntry {
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
export class CalendarComponent implements OnInit, OnChanges {
  @Input() currentDate: Date = new Date();
  private _currentSelectedDate$ = new BehaviorSubject<Date>(new Date);
  headers: number[] = [];
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
  hours: time[];
  currentRange: {start: Date, end: Date} = createRange(this.currentDate);

  constructor(public roomService: RoomService) {
    this.headers = this.getHeaderNumbers(this.currentRange.start);
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
    combineLatest(
      this.roomService.currentSelectedRoom$.pipe(startWith({events: []})),
      this._currentSelectedDate$.asObservable()
    ).subscribe(([currentRoom, currentDate]) => {
      this.eventsByDay = [[],[],[],[],[],[],[]];
      this.currentRange = createRange(currentDate);
      this.headers = this.getHeaderNumbers(this.currentRange.start);
      currentRoom.events.forEach(event => {
        const eventStartDay = (event.start.getDay() + 6) % 7;
        const eventEndDay = (event.end.getDay() + 6) % 7;
        if (event.start.valueOf() < this.currentRange.start.valueOf()) {
          if (event.end.valueOf() > this.currentRange.end.valueOf()) {
            [...Array(7).keys()].forEach(x => {
              this.eventsByDay[x].push({
                start: 0,
                height: 24,
                name: x ? '' : event.name,
                range: x ? '' : getRange(event)
              })
            })
          } else if (event.end.valueOf() > this.currentRange.start.valueOf() && event.end.valueOf() < this.currentRange.end.valueOf()) {
            // range elejetol az event vegeig szinezni
            [...Array(eventEndDay).keys()].forEach(x => {
              this.eventsByDay[x].push({
                start: 0,
                height: 24,
                name: x ? '' : event.name,
                range: x ? '' : getRange(event)
              })
            });
            this.eventsByDay[eventEndDay].push({
              start: 0,
              height: getNumberFormDate(event.end),
              name: '', //event.name,
              range: '' //getRange(event)
            });

          }
        } else if ( event.end.valueOf() > this.currentRange.end.valueOf()) {
          if (event.start.valueOf() < this.currentRange.end.valueOf()) {
            this.eventsByDay[eventStartDay].push({
              start: getNumberFormDate(event.start),
              height: 24 - getNumberFormDate(event.start),
              name: event.name,
              range: getRange(event)
            });
            [...Array(6 - eventStartDay).keys()].forEach(x => {
              this.eventsByDay[x + eventStartDay + 1].push({
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
              start: getNumberFormDate(event.start),
              height: getNumberFormDate(event.end) - getNumberFormDate(event.start),
              name: event.name,
              range: getRange(event)
            });
            return;
          }
          this.eventsByDay[eventStartDay].push({
            start: getNumberFormDate(event.start),
            height: 24 - getNumberFormDate(event.start),
            name: event.name,
            range: getRange(event)
          });

          this.eventsByDay[eventEndDay].push({
            start: 0,
            height: getNumberFormDate(event.end),
            name: '', //event.name,
            range: '', //getRange(event)
          });
          [...Array(eventEndDay - 1 - eventStartDay).keys()].forEach(x => {
            this.eventsByDay[x + eventStartDay + 1].push({
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

  ngOnChanges(changes: SimpleChanges): void {
    this._currentSelectedDate$.next(this.currentDate);
  }

  getHeaderNumbers(date: Date): number[] {
    const value = date.valueOf();
    const values: number[] = [];
    [...Array(7).keys()].forEach( v => {
      values.push(new Date(value + v * 24 * 60 * 60 * 1000).getDate());
    });
    return values;
  }

  ngOnInit() {}
}

function getRange(event: RoomEvent) {
  return event.start.toLocaleString(undefined, {hour: 'numeric', minute: 'numeric', hour12: false}) + ' - '
    + event.end.toLocaleString(undefined, {hour: 'numeric', minute: 'numeric', hour12: false})

}

function getNumberFormDate(date: Date): number {
  return date.getHours() + date.getMinutes() / 60
}

export function createRange(date: Date): {start: Date, end: Date} {
  const dayOfTheWeek = (date.getDay() + 6) % 7;
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf() - dayOfTheWeek * 24 * 60 * 60 * 1000;
  const end = start + 7 * 24 * 60 * 60 * 1000 - 1 ;
  return {
    start: new Date(start),
    end: new Date(end)
  }
}
