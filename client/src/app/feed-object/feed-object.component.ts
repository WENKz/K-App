import { Component, OnInit, Input } from '@angular/core';
import { FeedObject } from '../_models/FeedObject';

@Component({
  selector: 'app-feed-object',
  templateUrl: './feed-object.component.html',
  styleUrls: ['./feed-object.component.scss'],
})
export class FeedObjectComponent implements OnInit {

  index: number;
  @Input() feedObject: FeedObject;

  constructor() { }

  ngOnInit() {
    this.index = 0;
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

  checkMedia(type: String) {
    console.log(this.feedObject.medias[this.index]);
    console.log(this.feedObject.medias[this.index].type === type);
    return this.feedObject.medias[this.index].type === type;
  }
}
