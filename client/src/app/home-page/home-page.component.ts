import { Component, OnInit } from '@angular/core';
import { AuthService, FeedService } from '../_services';
import { ConnectedUser, FeedObject } from '../_models';
import * as moment from 'moment';

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})

export class HomePageComponent implements OnInit {

  private currentUser: ConnectedUser;
  feedObjects: FeedObject[];

  constructor(private authService: AuthService,
              private feedService: FeedService) { }

  ngOnInit(): void {
    this.authService.$currentUser.subscribe((curUser) => {
      this.currentUser = curUser;
    });
    this.feedService.get().subscribe((feedObjects) => {
      this.feedObjects = feedObjects.sort((a, b) => {
        if (a.pin) return -1;
        if (b.pin) return 1;
        return 0;
      });
    });
  }

  getName(): String {
    if (this.currentUser.specialAccount) {
      return this.currentUser.username;
    } if (this.currentUser.barman) {
      return this.currentUser.barman.nickname;
    }
    return '';
  }

  getSeniority() {
    const createdAt = moment(this.currentUser.createdAt);
    const yearDiff = moment().diff(createdAt, 'years');
    const monthDiff = moment().diff(createdAt.add(yearDiff, 'year'), 'months');
    const daysDiff = moment().diff(createdAt.add(yearDiff, 'year').add(monthDiff, 'month'), 'days');
    return moment().diff(createdAt, 'days') + ' jours soit '
      + yearDiff + ' an(s), '
      + monthDiff + ' mois et '
      + daysDiff + ' jour(s), ';
  }

  isConnected(): Boolean {
    return this.currentUser.accountType !== 'Guest';
  }
}
