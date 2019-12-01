import { Component, OnInit } from '@angular/core';
import { RoomService } from '../dashboard/room.service';

@Component({
  selector: 'app-manage-rooms',
  templateUrl: './manage-rooms.component.html',
  styleUrls: ['./manage-rooms.component.less']
})
export class ManageRoomsComponent implements OnInit {
  constructor(public roomService: RoomService) { }

  ngOnInit() {
  }

  refreshRooms() {
    this.roomService.refreshAllRooms();
  }

}
