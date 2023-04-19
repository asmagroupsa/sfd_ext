import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { Agence } from './agence.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class AgenceService {
    private resourceUrl = HOST + '/api/agences';
    private resourceSearchUrl = HOST + '/api/_search/agences';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(agence: Agence): Observable<Agence> {
        const copy = this.convert(agence);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(agence: Agence): Observable<Agence> {
        const copy = this.convert(agence);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<Agence> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        let id;
        if (UserData.getInstance().listeAgences && UserData.getInstance().listeAgences.length)
            id = UserData.getInstance().listeAgences[0].sfdId;
        if (!id)
            id = UserData.getInstance().sfdId;
        let sfdRef =
            UserData.getInstance().currentSfdReference ||
            UserData.getInstance().sfd;
        let filtre = sfdRef
            ? { 'sfdReference.equals': sfdRef }
            : { 'sfdId.equals': id };
        const options = createRequestOption(
            Object.assign({}, req, {
                NO_QUERY: true,
                ...filtre
            })
        );
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
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

    private convert(agence: Agence): Agence {
        const copy: Agence = Object.assign({}, agence);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            agence.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            agence.lastModifiedDate
        );
        return copy;
    }
}
