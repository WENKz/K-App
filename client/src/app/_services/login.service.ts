import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post('/api/auth/login', {username, password}).catch(this.handleError);
  }

  logout() {
    return this.http.get('/api/auth/logout').catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
        errorMessage = `Une erreur est survenue du côté client, vérifiez votre connexion internet`;
    } else {
        switch (err.error.error) {
            case 'LoginError':
                errorMessage = `Erreur: username ou mot de passe invalide`;
                break;
            case 'LogoutError':
                errorMessage = `Erreur durant la déconnexion`;
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
