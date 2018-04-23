import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectedUser, ConnectionInformation } from '../_models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class MeService {

    constructor(private http: HttpClient) { }

    put(connectedUser: ConnectedUser): Observable<any> {
        let body;
        if (connectedUser.isBarman()) {
            body = {
                barman: connectedUser.barman,
            };
            delete body.barman.id;
        } else {
            body = {
                specialAccount: connectedUser.specialAccount,
            };
            delete body.specialAccount.id;
        }

        return this.http.put('/api/me', body);
    }

    resetPassword(connexion: ConnectionInformation, oldPassword: string): Observable<any> {
        const body = {
            username: connexion.username,
            password: connexion.password,
            oldPassword: oldPassword,
            passwordToken: undefined,
        };
        return this.http.put('/api/auth/reset-password', body);
    }
}
