import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const BASE_ICON_PATH = 'assets/img/';

const icons: {name: string; path: string;}[] = [
  {
    name: 'add_alert',
    path: 'add_alert-24px.svg'
  },
  {
    name: 'arrow-left',
    path: 'keyboard_arrow_left-24px.svg'
  },
  {
    name: 'arrow-right',
    path: 'keyboard_arrow_right-24px.svg'
  },
  {
    name: 'check',
    path: 'check-24px.svg'
  },
  {
    name: 'edit',
    path: 'edit-24px.svg'
  },
  {
    name: 'close',
    path: 'close-24px.svg'
  },
  {
    name: 'delete',
    path: 'delete_forever-24px.svg'
  },
  {
    name: 'add',
    path: 'add-24px.svg'
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'room-booking-tool';
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    icons.forEach(icon => {
      iconRegistry.addSvgIcon(
        icon.name,
        sanitizer.bypassSecurityTrustResourceUrl(BASE_ICON_PATH + icon.path));
    });
  }
}
