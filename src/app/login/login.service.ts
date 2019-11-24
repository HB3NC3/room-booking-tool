import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, startWith} from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  expiration: string;
  isAdmin: boolean;
}

const USER = 'user';
const TOKEN = 'token';
const IS_ADMIN = 'is_admin';
const LOGIN_PATH = '/api/login';

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
      catchError(() => {
        return of({} as LoginResponse);
      }),
      map(response => {
        if (!response.token) {
          return false;
        }
        saveCredentials(userName, response.token, response.isAdmin);
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
    this.router.navigateByUrl('/login');
  }

  get userName(): string {
    return localStorage.getItem(USER);
  }

  get isAdmin(): boolean {
    return localStorage.getItem(IS_ADMIN) === 'true';
  }

  get token(): string {
    return localStorage.getItem(TOKEN);
  }

  private sendLoginRequest(userName: string, password: string): Observable<HttpResponse<LoginResponse>> {
    return this.http.post<LoginResponse>(LOGIN_PATH, {username: userName, password}, {observe: 'response'});
  }
}

function saveCredentials(userName: string, token: string, isAdmin: boolean) {
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(USER, userName);
  localStorage.setItem(IS_ADMIN, isAdmin.toString());
}
