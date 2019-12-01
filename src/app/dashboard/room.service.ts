import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

const ROOMS_PATH = '/teremfoglalo/room';

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
  private _rooms$ = new ReplaySubject<Room[]>(1);
  public currentSelectedRoom$ = this._currentSelectedRoom$.asObservable();
  public rooms$ = this._rooms$.asObservable();

  constructor(private http: HttpClient) {
    this.refreshAllRooms();
  }

  selectRoom(room: Room) {
    this._currentSelectedRoom$.next(room);
  }

  private getRooms(): Observable<HttpResponse<Room[]>> {
    return this.http.get<Room[]>(ROOMS_PATH, {observe: 'response'});
  }

  public refreshAllRooms() {
    this.getRooms().pipe(map(x => x.body), catchError(() => of([]))).subscribe(rooms => {
      this._rooms$.next(rooms);
      this.selectRoom(rooms && rooms[0]);
    });
  }

  modifyRoom(room: Room) {
    return this.http.put(`${ROOMS_PATH}/${room.id}`, {location: room.location, name: room.name});
  }

  addRoom(room: Room) {
    return this.http.post(ROOMS_PATH, {location: room.location, name: room.name});
  }

  deleteRoom(id: string) {
    return this.http.delete(`${ROOMS_PATH}/${id}`);
  }
}
