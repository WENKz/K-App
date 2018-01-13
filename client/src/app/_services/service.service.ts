import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Service } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class ServiceService {

    constructor(private http: HttpClient) { }

    getById(id: number) {
        return this.http.get<Service>('/api/services/' + id).catch(this.handleError);
    }

    create(service: Service) {
        return this.http.post('/api/services', service).catch(this.handleError);
    }

    update(service: Service) {
        return this.http.put('/api/services/' + service.id, service).catch(this.handleError);
    }

    delete(id: number) {
        return this.http.delete('/api/services/' + id).catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            console.log(err);
            switch (err.error) {
                case 'Not Found':
                    errorMessage = `Erreur, impossible d'ajouter un service`;
                    break;
                case 'ServerError':
                    errorMessage = `Erreur serveur`;
                    break;
                default:
                    errorMessage = 'Code d\'erreur inconnu';
                    break;
            }
        }
        return Observable.throw(errorMessage);
    }
}
