import { AssociationChanges, ConnectionInformation, Kommission, Role, Service } from '.';
import {BarmanStatistics} from "./BarmanStatistics";

export class Barman {

  id: number;
  lastName: string;
  firstName: string;
  nickname: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  facebook: string;
  dateOfBirth: Date;
  flow: string;
  leaveAt: Date;

    // Associations

  statistics: BarmanStatistics;
  connection: ConnectionInformation;
  godFather: Barman;
  kommissions: Kommission[];
  roles: Role[];
  services: Service[];

  _embedded: {
    godFather?: number;
    kommissions?: AssociationChanges;
    roles?: AssociationChanges;
  };

  public isActive(): boolean {
    return !this.leaveAt;
  }

  constructor(values: Partial<Barman> = {}) {
    Object.assign(this, values);
  }
}
