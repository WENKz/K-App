import { Media } from './Media';
import { Category } from './Category';

export class FeedObject {
  id?: Number;
  title: String;
  content: String; // Markdown content
  createdAt: Date;
  updatedAt: Date;
  date: Date; // Event date or = createdAt date
  pin: Boolean;
  isFacebook: Boolean;
  medias: Media[];
  openLink?: String;
  categories: Category[];
}
