import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoginService, Role } from "../login/login.service";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

const REGISTER_URL = "/teremfoglalo/system-user/register";
const USERS_URL = "/teremfoglalo/system-user/all";
const CHANGE_ROLE_URL = "/teremfoglalo/system-user";
export interface User {
  id: string;
  username: string;
  role: Role;
  newRole: Role;
}

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  public register(userName: string, password: string) {
    return this.http.post(REGISTER_URL, {
      username: userName,
      password: password
    });
  }

  public getUsers$(): Observable<User[]> {
    return this.http
      .get<User[]>(USERS_URL, { observe: "response" })
      .pipe(
        map(x => x.body),
        map(x =>
          x.map(y => {
            y.newRole = y.role;
            return y;
          })
          .filter(y => y.username !== this.loginService.userName)
          .sort((a, b) => a.username < b.username ? -1 : (a.username > b.username ? 1 : 0))
        ),
        catchError(() => of([]))
      );
  }

  changeRole(user: User) {
    return this.http.put(CHANGE_ROLE_URL, {
      username: user.username,
      desiredRole: user.newRole
    });
  }
}
