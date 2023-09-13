
import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { ConditionRequest } from './condition-request.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import {
    getUserRefOrChaineAgence
} from '../../shared/model/functions';
import { Injectable } from '@angular/core';

@Injectable()
export class ConditionRequestService {
    private conditionsUrl = HOST + '/api/condition-acces';
    private resourceUrl = HOST + '/api/condition-request';
    private resourceSearchUrl = HOST + '/api/_search/condition-request';
    private conditionsAccesUrl = HOST + '/api/client/liste-condition-acces';
    private elementConditionUrl = HOST + '/api/client/liste-element-acces';
    private clientSansConditionUrl = HOST + '/api/client/liste-client-condition-acces';
    private noteClientProduitUrl = HOST + '/api/client/verification-note-client-produit';
    private listeNoteClientProduitUrl = HOST + '/api/client/liste-note-par-client-produit';
    private listeValeursConditionsNoteUrl = HOST + '/api/client/liste-valeurs-conditions-par-note';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }
    listeConditions(ids: any): Observable<ResponseWrapper> {
        const options = createRequestOption({ NO_QUERY: true, 'id.in': ids });
        return this.http
            .get(this.conditionsUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    listeConditionsProduit(produit: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('produit_id', produit);
        
        return this.http
            .get(this.conditionsAccesUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    listeElementCondition(condition: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('condition_id', condition);
        
        return this.http
            .get(this.elementConditionUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    listeValeursConditionsNote(code: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('code_note', code);
        
        return this.http
            .get(this.listeValeursConditionsNoteUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    listeNoteClientProduit(
        produit: any,
        client: any
    ): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('id_produit', produit);
        options.params.set('id_client', client);
        
        return this.http
            .get(this.listeNoteClientProduitUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    verificationNoteClient(
        produit: any,
        client: any
    ): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('id_client', client);
        options.params.set('id_produit', produit);
        
        return this.http
            .get(this.noteClientProduitUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    queryClientSansCondition(
        produit: any,
        etat: string
    ): Observable<ResponseWrapper> {
        let params = getUserRefOrChaineAgence();
        let req = {
            'produit': produit,
            'etat': etat,
           
        };
        req[params[0]] = params[1];
        const options = createRequestOption(req);
        return this.http
            .get(this.clientSansConditionUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    create(conditions: ConditionRequest): Observable<ConditionRequest> {
        const copy = this.convert(conditions);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(conditions: ConditionRequest): Observable<ConditionRequest> {
        const copy = this.convert(conditions);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<ConditionRequest> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(conditions: ConditionRequest): ConditionRequest {
        const copy: ConditionRequest = Object.assign({}, conditions);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            conditions.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            conditions.lastModifiedDate
        );
        return copy;
    }
}
