import { HOST_MVN } from '../model/request-util';

import { EventBus } from '../model/functions';

import { Principal } from '../auth/principal.service';
import { Http, Response } from '@angular/http';
import { ResponseWrapper } from '..';
import { createRequestOption, HOST } from '../model/request-util';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
@Injectable()
export class FirstConnectionService {
    private url = HOST + '/api/sfd/insertion-parametre';
    constructor(
        private principal: Principal,
        private http: Http
    ) { }
    firstConnectionUpdate(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(
            Object.assign({}, req, { NO_QUERY: true })
        );
        /* if(true == true){ //Le temps de corriger cet erreur serveur
            return Observable.create(observer => {
                observer.next(new ResponseWrapper(null,{},200));
            });
        } */
        return this.http
            .get(HOST_MVN + '/api/account/first-connection-update', options)
            .map((res: Response) => this.convertResponse(res));
    }
    insertionParametres(params: InsertionParam, req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(
            Object.assign({}, req, { NO_QUERY: true })
        );
        options.params.set('ordre_typeclient', params.ordre_typeclient);
        options.params.set('ordre_compteur', params.ordre_compteur);
        options.params.set('ordre_agence', params.ordre_agence);
        options.params.set('ordre_sfd', params.ordre_sfd);
        options.params.set('position_compteur', params.position_compteur);
        options.params.set('initial_sfd', params.initial_sfd);
        options.params.set('separateur', params.separateur);
        options.params.set('sfd_id', params.sfd_id);
        options.params.set('type_compteur', params.type_compteur);
        return this.http
            .get(this.url, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                 this.firstConnectionUpdate().subscribe((res: Response) => {
                    if(this.principal.userIdentity){
                    this.principal.userIdentity.firstConnection = false;
                    this.principal.setUserIdentity(this.principal.userIdentity);
                    }
                });
                return this.convertResponse(res);
            });
    }
    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }
}
export interface InsertionParam {
    ordre_typeclient: any,
    ordre_compteur: any,
    ordre_agence: any,
    position_compteur: any,
    initial_sfd: any,
    separateur: any,
    sfd_id: any,
    type_compteur: any,
    ordre_sfd: any
}
