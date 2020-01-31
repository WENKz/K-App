export interface TemplateServiceUnit {
  nbMax?: number;

  startDay: number;
  startHours: number;
  startMinutes: number;

  endDay: number;
  endHours: number;
  endMinutes: number;
}

export interface Template {

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  services: TemplateServiceUnit[];
}
