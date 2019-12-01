import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-deletable-list-item',
  templateUrl: './deletable-list-item.component.html',
  styleUrls: ['./deletable-list-item.component.less']
})
export class DeletableListItemComponent {
  @Input() name = '';
  @Input() disabled = false;
  @Output() closeClicked = new EventEmitter<void>();

  constructor() { }

  remove() {
    if (this.disabled) {
      return;
    }
    this.closeClicked.emit();
  }
}
