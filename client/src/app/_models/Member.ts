import { Registration } from './Registration';

export class Member {

  id: Number;
  lastName: String;
  firstName: String;
  school: String;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  registrations: Registration[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
