import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Room, RoomService } from '../dashboard/room.service';

@Component({
  selector: 'app-editable-room-field',
  templateUrl: './editable-room-field.component.html',
  styleUrls: ['./editable-room-field.component.less']
})
export class EditableRoomFieldComponent implements OnChanges {
  @Input() room: Room;
  @Input() isNew = false;
  @Output() onSaved = new EventEmitter<void>();
  location = '';
  name = '';
  isLoading = false;
  isEditing = false;

  constructor(private roomService: RoomService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.room) {
      this.location = this.room.location;
      this.name = this.room.location;
    }
  }

  onSaveClick() {
    if (!(this.location && this.name)) {
      return;
    }
    if (!this.isNew && this.location === this.room.location && this.name === this.room.name) {
      this.isEditing = false;
      return;
    }
    this.isLoading = true;
    if (this.isNew) {
      this.roomService.addRoom({name: this.name, location: this.location} as Room).subscribe(() => {
          this.isEditing = false;
          this.onSaved.emit();
          this.reset();
        },
        () => {
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        })
    } else {
      this.roomService.modifyRoom({id: this.room.id, name: this.name, location: this.location} as Room).subscribe(() => {
          this.isEditing = false;
          this.room.location = this.location;
          this.room.name = this.name;
          this.onSaved.emit();
        },
        () => {
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
      })
    }
  }

  onDelete() {
    this.isLoading = true;
    this.roomService.delete(this.room.id).subscribe(() => {
      this.onSaved.emit();
      },
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      })
  }

  private reset() {
    this.location = '';
    this.name = '';
  }
}
