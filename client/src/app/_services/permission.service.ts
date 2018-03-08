import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Permission } from '../_models/index';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PermissionService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Permission[]>('/api/permissions').catch(this.handleError);
    }

    getById(id: Number) {
        return this.http.get<Permission>('/api/permissions/' + id).catch(this.handleError);
    }

    create(permission: Permission) {
        return this.http.post('/api/permissions', permission).catch(this.handleError);
    }

    update(permission: Permission) {
        const id = permission.id;
        delete permission.id;
        return this.http.put('/api/permissions/' + id, permission).catch(this.handleError);
    }

    delete(id: Number) {
        return this.http.delete('/api/permissions/' + id).catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
        } else {
            switch (err.error.error) {
                case 'UknownRole':
                    errorMessage = `Erreur, impossible de recuperer le role`;
                    break;
                case 'UnauthorizedError':
                    errorMessage = `Erreur: opération non autorisée`;
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
