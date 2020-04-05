import { Component, OnInit } from '@angular/core';
import { WeekViewerController } from '../service-week-viewer/week-viewer-controller';
import { addDays } from 'date-fns';

@Component({
  selector: 'app-open-services',
  templateUrl: './open-services.component.html',
})

export class OpenServicesComponent implements OnInit {

  private weekViewerController: WeekViewerController;

  constructor() { }

  ngOnInit(): void {
    this.weekViewerController = new WeekViewerController([
      { key: '1', start: addDays(new Date(), 7), end: new Date() },
      { key: '2', start: addDays(new Date(), 4), end: new Date() },
      { key: '23', start: addDays(new Date(), 4), end: new Date() },
      { key: '24', start: addDays(new Date(), 4), end: new Date() },
      { key: '3', start: addDays(new Date(), 5), end: new Date() },
    ]);
  }
}
