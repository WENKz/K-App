import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Barman, Service, Task } from '../../shared/models';
import { toURL } from './api-utils';
import {BarmanStatistics} from "../../shared/models/BarmanStatistics";

@Injectable()
export class BarmanService {

  constructor(private http: HttpClient) { }

  getAll(): Promise<Barman[]> {
    return this.http.get<Barman[]>(toURL('v1/barmen')).toPromise();
  }

  getById(id: number): Promise<Barman> {
    return this.http.get<Barman>(toURL(`v1/barmen/${id}`)).toPromise()
      .then((b) => new Barman(b));
  }

  getServices(id: number, start: Date, end: Date): Promise<Service[]> {
    return this.http.get<Service[]>(toURL(`v1/barmen/${id}/services`), {
      params: {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      },
    }).toPromise();
  }

  getTasks(): Promise<Task[]> {
    return this.http.get<Task[]>(toURL('v1/me/tasks')).toPromise();
  }

  getStatistics(id: number): Promise<BarmanStatistics> {
    return this.http.get<BarmanStatistics>(toURL(`v1/barmen/${id}/statistics`)).toPromise()
      .then((res) => new BarmanStatistics(res));
  }

  create(barman: Barman): Promise<Barman> {
    return this.http.post<Barman>(toURL('v1/barmen'), barman).toPromise();
  }

  getAllActiveBarmenWithServices(start: Date, end: Date): Promise<Barman[]> {
    return this.http.get<Barman[]>(toURL('v1/barmen/services'), {
      params: {
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      },
    }).toPromise();
  }

  addService(id: number, services: number[]): Promise<Service> {
    return this.http.post<Service>(toURL(`v1/barmen/${id}/services`), services).toPromise();
  }

  removeService(id: number, services: number[]): Promise<Service> {
    return this.http.post<Service>(toURL(`v1/barmen/${id}/services/delete`), services).toPromise();
  }

  update(barman: Barman): Promise<Barman> {
    return this.http.put<Barman>(toURL(`v1/barmen/${barman.id}`), barman).toPromise();
  }

  delete(id: number): Promise<Barman> {
    return this.http.post<Barman>(toURL(`v1/barmen/${id}/delete`), null).toPromise();
  }
}
