import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeedObject } from '../_models';
import { Observable, of } from 'rxjs';

@Injectable()
export class FeedService {

  constructor(private http: HttpClient) { }

  get(): Observable<FeedObject[]> {
    const feedObjects: FeedObject[] = [];
    const feedObject1: FeedObject = {
      title: 'Test 1',
      content: 'Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date(),
      pin: true,
      isFacebook: false,
      medias: [{
        url: 'https://i.imgur.com/y2ejS3S.jpg',
        type: 'image',
      }, {
        url: 'https://images.pexels.com/photos/458766/pexels-photo-458766.jpeg?auto=compress&cs=tinysrgb&h=350',
        type: 'image',
      }],
      openLink: 'https://i.imgur.com/y2ejS3S.jpg',
      categories: [{
        name: 'Categorie 1',
        shortDescription: 'Yes',
      }],
    };
    const feedObject2: FeedObject = {
      title: 'Test 2',
      content: 'Content',
      createdAt: new Date(),
      updatedAt: new Date(),
      date: new Date(),
      pin: false,
      isFacebook: false,
      medias: [{
        url: 'https://images.pexels.com/photos/458766/pexels-photo-458766.jpeg?auto=compress&cs=tinysrgb&h=350',
        type: 'image',
      }, {
        url: 'https://i.imgur.com/y2ejS3S.jpg',
        type: 'image',
      }],
      openLink: 'https://images.pexels.com/photos/458766/pexels-photo-458766.jpeg?auto=compress&cs=tinysrgb&h=350',
      categories: [{
        name: 'Categorie 1',
        shortDescription: 'Yes',
      }],
    };
    feedObjects.push(feedObject1);
    feedObjects.push(feedObject2);
    feedObjects.push(feedObject1);
    feedObjects.push(feedObject2);
    return of(feedObjects);
    // return this.http.get<FeedObject[]>('/api/feed');
  }
}
