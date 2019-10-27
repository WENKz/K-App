import {Barman} from "./Barman";

export class BarmanStatistics {
  hoursOfService: number;
  barmenWhichSpendTheMostTimeWith: {
    barman: Barman;
    nbHours: number;
  }[];
  barmenWhichSpendTheLessTimeWith: {
    barman: Barman;
    nbHours: number;
  }[];

  constructor(values: Partial<BarmanStatistics> = {}) {
    Object.assign(this, values);
  }
}
