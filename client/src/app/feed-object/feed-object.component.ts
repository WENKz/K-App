import { Component, OnInit, Input } from '@angular/core';
import { FeedObject } from '../_models/FeedObject';

@Component({
  selector: 'app-feed-object',
  templateUrl: './feed-object.component.html',
  styleUrls: ['./feed-object.component.scss'],
})
export class FeedObjectComponent implements OnInit {

  @Input() feedObject: FeedObject;

  constructor() { }

  ngOnInit() {
  }

  getFeedObjectCat(): String {
    return this.feedObject.categories.map(c => c.name).join(', ');
  }

}
