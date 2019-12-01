import { Component, EventEmitter, Output } from '@angular/core';
import { User, UserService } from '../register-form/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.less']
})
export class ManageUsersComponent {
  @Output() onCloseDialog = new EventEmitter();
  users: User[];
  roles = ['ADMIN', 'REGISTERED'];

  constructor(
    public userService: UserService
  ) {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers$().subscribe(users => {
      this.users = users;
    });
  }

  onClick(user: User) {
    if (user.role === user.newRole) {
      return;
    }
    this.userService.changeRole(user).subscribe(() => {
      this.getUsers();
    },
      () => {});
  }
}
