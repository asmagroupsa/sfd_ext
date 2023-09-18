import { HOST_MVN } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { Ressource } from './ressource.model';
import { ResponseWrapper } from '../../shared';
import { createRequestOption } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
@Injectable()
export class RessourceService {
    private resourceUrl = HOST_MVN + '/api/ressources';
    private listeAuthResourceUrl = HOST_MVN + '/api/user/liste-ressource-authority';
    private authResourceUrl = HOST_MVN + '/api/authority-resources';
    private insertRessourceUrl = HOST_MVN + '/api/user/insert-authority-ressource';
    private resourceSearchUrl = HOST_MVN + '/api/_search/ressources';

    constructor(private http: Http) { }
    queryAuthorities(authority: string, state: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('authority', authority);
        options.params.set('etat', state);
        options.params.set('type', 'SFD');
        
        return this.http
            .get(this.listeAuthResourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => this.convertResponse(res));
    }

    addAuthorityRessources(model: any): any {
        const options = createRequestOption();
        
        options.params.set('authority', model.profile);
        options.params.set('chaineRessource', model.ressources.join('*'));
        
        options.params.set('type', 'SFD');
        return this.http
            .get(this.insertRessourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return res.json();
            });
    }

    removeAuthorityRessources(model: any) {
        const options = createRequestOption();
        options.params.set('authority', model.profile);
        options.params.set('ressource', model.ressources.join('*'));
        options.params.set('type', 'SFD');
        return this.http
            .get(`${HOST_MVN}/api/user/suppression-ressource-profil`, options)
            .map((res: Response) => res.json());
    }

    create(ressource: Ressource): Observable<Ressource> {
        const copy = this.convert(ressource);
        const options = createRequestOption();
        options.params.set('type', 'SFD');
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return res.json();
            });
    }

    update(ressource: Ressource): Observable<Ressource> {
        const copy = this.convert(ressource);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return res.json();
            });
    }

    find(id: number): Observable<Ressource> {
        const options = createRequestOption();
        options.params.set('type', 'SFD');
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return res.json();
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(Object.assign({}, req, {
            NO_QUERY: true
        }));

        options.params.set('type', 'SFD');
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        options.params.set('type', 'SFD');
        return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        let rsc: string = "carmesfnmservice/api/devConfigRessources"
        let jsonRespons: any[] = res.json() || [];
        const jsonResponse = jsonRespons.filter(obj => obj.code != rsc)
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(ressource: Ressource): Ressource {
        const copy: Ressource = Object.assign({}, ressource);
        return copy;
    }
}
