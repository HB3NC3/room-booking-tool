import { Component, OnInit } from '@angular/core';

interface time {
  display: string;
  hours: number;
  minutes: number;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {
  headers: number[] = [];
  days: string[] = ['H', 'K', 'SZE', 'CS', 'P', 'SZO', 'V'];
  hours: time[];

  constructor() {
  this.headers = Array(7).fill(1).map((val, idx) => idx + 1);
  this.hours = Array(24).fill(1).map((val, idx) => {
    return {
      display: `${idx.toString().padStart(2, '0')}:${(0).toString().padStart(2, '0')}`,
      hours: idx,
      minutes: 0
    }
  })
}

  ngOnInit() {
  }

}
