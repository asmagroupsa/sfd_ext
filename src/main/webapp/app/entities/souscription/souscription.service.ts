import { HOST_MVN } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { Souscription } from './souscription.model';
import { ResponseWrapper } from '../../shared';
import { createRequestOption } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
@Injectable()
export class SouscriptionService {
    private resourceUrl = HOST_MVN + '/api/souscriptions';
    private listeAuthResourceUrl = HOST_MVN + '/api/user/liste-souscription-authority';
    private authResourceUrl = HOST_MVN + '/api/authority-resources';
    private insertSouscriptionUrl = HOST_MVN + '/api/user/insert-authority-souscription';
    private resourceSearchUrl = HOST_MVN + '/api/_search/souscriptions';

    constructor(private http: Http) { }
    queryAuthorities(authority: string, state: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        const urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('authority', authority);
        urlParams.set('etat', state);
        options.params.set('type', 'SFD');
        options.params = urlParams;
        return this.http
            .get(this.listeAuthResourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => this.convertResponse(res));
    }

    addAuthoritySouscriptions(model: any): any {
        const options = createRequestOption();
        const urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('authority', model.profile);
        urlParams.set('chaineSouscription', model.souscriptions.join('*'));
        options.params = urlParams;
        options.params.set('type', 'SFD');
        return this.http
            .get(this.insertSouscriptionUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return res.json();
            });
    }

    removeAuthoritySouscriptions(model: any) {
        const options = createRequestOption();
        options.params = new URLSearchParams();
        options.params.set('authority', model.profile);
        options.params.set('souscription', model.souscriptions.join('*'));
        options.params.set('type', 'SFD');
        return this.http
            .get(`${HOST_MVN}/api/user/suppression-souscription-profil`, options)
            .map((res: Response) => res.json());
    }

    create(souscription: Souscription): Observable<Souscription> {
        const copy = this.convert(souscription);
        const options = createRequestOption();
        options.params.set('type', 'SFD');
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return res.json();
            });
    }

    update(souscription: Souscription): Observable<Souscription> {
        const copy = this.convert(souscription);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return res.json();
            });
    }

    find(id: number): Observable<Souscription> {
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
        let rsc: string = "carmesfnmservice/api/devConfigSouscriptions"
        let jsonRespons: any[] = res.json() || [];
        const jsonResponse = jsonRespons.filter(obj => obj.code != rsc)
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(souscription: Souscription): Souscription {
        const copy: Souscription = Object.assign({}, souscription);
        return copy;
    }
}
