import { Component, OnInit, Input } from '@angular/core';
import { FeedObject } from '../_models/FeedObject';

@Component({
  selector: 'app-feed-object',
  templateUrl: './feed-object.component.html',
  styleUrls: ['./feed-object.component.scss'],
})
export class FeedObjectComponent implements OnInit {

  index: number = 0;
  @Input() feedObject: FeedObject;

  constructor() { }

  ngOnInit() {
  }

  getFeedObjectCat(): String {
    return this.feedObject.categories.map(c => c.name).join(', ');
  }

  getImageSource() {
    return this.feedObject.medias[this.index].url;
  }

  incrementeIndex() {
    this.index = this.index + 1;
  }

  decrementeIndex() {
    this.index = this.index - 1;
  }
}
