import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-deletable-list-item',
  templateUrl: './deletable-list-item.component.html',
  styleUrls: ['./deletable-list-item.component.less']
})
export class DeletableListItemComponent {
  @Input() name = '';
  @Output() closeClicked = new EventEmitter<void>();

  constructor() { }

  remove() {
    this.closeClicked.emit();
  }
}
