import { Injectable } from '@angular/core';
import { Room, RoomService } from './room.service';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoginService } from '../login/login.service';

const EVENTS_PATH = '/teremfoglalo/event';
export const ONE_HOUR_MS = 60 * 60 * 1000;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;

export interface RoomEvent {
  id: string;
  name: string;
  description: string;
  creator: {
    role: string;
    username: string;
  };
  startDate: string;
  start?: Date;
  end?: Date;
  endDate: string;
  isPrivate: boolean;
  roomList: Room[];
  roomIds: string[];
}

export interface Interval {
  start: Date;
  end: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private _currentDate: Date;
  private _currentRange$: ReplaySubject<Interval> = new ReplaySubject<Interval>(1);
  private _currentSelectedDate$: ReplaySubject<Date> = new ReplaySubject<Date>(1);
  private _events$: ReplaySubject<RoomEvent[]> = new ReplaySubject<RoomEvent[]>(1);
  public currentRange$: Observable<{start: Date, end: Date}> = this._currentRange$.asObservable();
  public currentSelectedDate$: Observable<Date> = this._currentSelectedDate$.asObservable();
  public events$: Observable<RoomEvent[]> = this._events$.asObservable();

  constructor(
    private http: HttpClient,
    private roomService: RoomService,
    private loginService: LoginService
  ) {
    this.selectDate(new Date());
    combineLatest(
      this.roomService.currentSelectedRoom$,
      this.currentRange$,
      this.loginService.loginChanged$
    ).pipe(
      switchMap(([room, range]) => this.getEvents$(room.id, range)),
      map(x => x.body),
      map(events => {
        events.forEach(event => {
          event.start = new Date(Date.parse(event.startDate));
          event.end = new Date(Date.parse(event.endDate));
        });
        return events;
      }),
      catchError(() => of([]))
    ).subscribe((events) => {
      this._events$.next(events);
    })
  }

  public selectDate(date: Date) {
    this._currentDate = date;
    this._currentSelectedDate$.next(date);
    this._currentRange$.next(createRange(date));
  }

  public nextRange() {
    const date = new Date(this._currentDate.valueOf() + 7 * ONE_DAY_MS);
    this.selectDate(date);
  }

  public previousRange() {
    const date = new Date(this._currentDate.valueOf() - 7 * ONE_DAY_MS);
    this.selectDate(date);
  }

  public addEvent(event: RoomEvent) {
    return this.http.post(EVENTS_PATH, {
      isPrivate: event.isPrivate,
      roomIds: event.roomIds,
      startDate: event.start.toISOString(),
      endDate: event.end.toISOString(),
      description: event.description,
      name: event.name
    } as RoomEvent);
  }

  public refresh() {
    this.selectDate(this._currentDate);
  }

  public modifyEvent(event: RoomEvent) {
    return this.http.put(`${EVENTS_PATH}/${event.id}`, {
      isPrivate: event.isPrivate,
      roomIds: event.roomIds,
      startDate: event.start.toISOString(),
      endDate: event.end.toISOString(),
      description: event.description,
      name: event.name
    } as RoomEvent);
  }

  private getEvents$(roomId: string, interval: Interval): Observable<HttpResponse<RoomEvent[]>> {
    const postBody = {
      startDate: interval.start.toISOString(),
      endDate: interval.end.toISOString()
    };
    const httpParams = new HttpParams().set('id', roomId);
    return this.http.post<RoomEvent[]>(`${EVENTS_PATH}/interval/id`, postBody, {observe: 'response', params: httpParams});
  }

  deleteEvent(id: string) {
    return this.http.delete(`${EVENTS_PATH}/${id}`);
  }
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
