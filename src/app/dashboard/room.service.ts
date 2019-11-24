import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface RoomEvent {
  start: Date;
  end: Date;
  name: string;
}

export interface Room {
  id: number;
  name: string;
  place: string;
  events: RoomEvent[];
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private _currentSelectedRoom$ = new ReplaySubject<Room>(1);
  private _allRooms$ = new ReplaySubject<Room[]>(1);
  public currentSelectedRoom$ = this._currentSelectedRoom$.asObservable();
  public allRooms$ = this._allRooms$.asObservable();

  constructor(private http: HttpClient) {
    this.refreshAllRooms();
  }

  selectRoom(room: Room) {
    this._currentSelectedRoom$.next(room);
  }

  public refreshAllRooms() {
    this._allRooms$.next([
      {
        id: 0,
        name: 'room1',
        place: 'asd utca 32',
        events: [
          {
            name: 'random event 1',
            start: new Date(2019,10,24,12,0),
            end: new Date(2019,10,24,15,30),
          },
          {
            name: 'random event 2',
            start: new Date(2019,10,18,12,0),
            end: new Date(2019,10,20,11,0),
          },
          {
            name: 'random event 2',
            start: new Date(2019,10,20,13,0),
            end: new Date(2019,10,23,18,0),
          }

        ]
      },
      {
        id: 1,
        name: 'room2',
        place: 'asdf utca 21',
        events: [
          {
            name: 'random event 1131',
            start: new Date(2019,10,21,12,0),
            end: new Date(2019,10,26,15,30),
          },
          {
            name: 'random event 2',
            start: new Date(2019,10,17,12,0),
            end: new Date(2019,10,19,11,0),
          }
        ]
      },
      {
        id: 2,
        name: 'room3',
        place: 'asdf utca 21',
        events: [
          {
            name: 'random event 1131',
            start: new Date(2019,9,25,12,0),
            end: new Date(2019,11,25,15,30),
          },
          {
            name: 'random event 2',
            start: new Date(2019,10,21,12,0),
            end: new Date(2019,10,22,11,0),
          }
        ]
      }
    ]);
  }
}
