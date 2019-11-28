import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

const ROOMS_PATH = '/teremfoglalo/room';
const EVENTS_PATH = '/teremfoglalo/event/all';
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export interface Event {
  creator: {
    role: string;
    username: string;
  };
  startDate: string;
  start?: Date;
  end?: Date;
  endDate: string;
  isPrivate: true;
  roomList: Room[];
}

export interface Room {
  id: string;
  name: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private _currentSelectedRoom$ = new ReplaySubject<Room>(1);
  private _allEvents$ = new ReplaySubject<Event[]>(1);
  public currentSelectedRoom$ = this._currentSelectedRoom$.asObservable();
  public allEvent$ = this._allEvents$.asObservable();

  constructor(private http: HttpClient) {
    this.refreshAllRooms();
  }

  selectRoom(room: Room) {
    this._currentSelectedRoom$.next(room);
  }

  private getRooms(): Observable<HttpResponse<Room[]>> {
    return this.http.get<Room[]>(ROOMS_PATH, {observe: 'response'});
  }

  private getEvents(): Observable<HttpResponse<Event[]>> {
    return this.http.get<Event[]>(EVENTS_PATH, {observe: 'response'});
  }

  public refreshAllRooms() {
    this.getEvents().pipe(map(x => x.body)).subscribe(events => {
      this._allEvents$.next(events.map(event => {
        event.start = new Date(Date.parse(event.startDate));
        event.end = new Date(Date.parse(event.endDate));
        return event;
      }))
    });

  }
}
