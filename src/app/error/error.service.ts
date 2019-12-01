import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _error$ = new Subject<string>();
  public error$: Observable<string> = this._error$.asObservable();

  constructor() { }

  public notifyError(message: string) {
    if (!message) {
      return;
    }
    this._error$.next(message);
    setTimeout(() => {
      this._error$.next(null);
    }, 5000);
  }
}
