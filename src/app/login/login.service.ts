import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export enum Role {
  GUEST,
  USER,
  ADMIN
}

const USER = 'user';
const TOKEN = 'token';
const ROLE = 'role';
const LOGIN_PATH = '/teremfoglalo/system-user/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(userName: string, password: string): Observable<boolean> {
    return this.sendLoginRequest(userName, password).pipe(
      map(x => x.body),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 200) {
          return of(e.error.text);
        }
        return of(null);
      }),
      map(response => {
        if (!response) {
          return false;
        }
        saveCredentials(userName, response as string, Role.USER);
        return true;
      }),
      startWith(null)
    );
  }

  isLoggedIn(): boolean {
    return !!this.token && !!this.userName;
  }

  logout() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
  }

  get userName(): string {
    return localStorage.getItem(USER);
  }

  get isAdmin(): boolean {
    const item = localStorage.getItem(ROLE);
    return item && parseInt(item) === Role.ADMIN;
  }

  get token(): string {
    return localStorage.getItem(TOKEN);
  }

  private sendLoginRequest(username: string, password: string): Observable<HttpResponse<string>> {
    return this.http.post<string>(LOGIN_PATH, {username: username, password}, {observe: 'response'});
  }
}

function saveCredentials(userName: string, token: string, role: Role) {
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(USER, userName);
  localStorage.setItem(ROLE, role.toString());
}
