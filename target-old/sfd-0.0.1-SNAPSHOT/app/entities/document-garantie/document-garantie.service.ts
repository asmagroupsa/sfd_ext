import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { DocumentGarantie } from './document-garantie.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class DocumentGarantieService {

    private resourceUrl = HOST + '/api/document-garanties';
    private resourceSearchUrl = HOST + '/api/_search/document-garanties';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(documentGarantie: DocumentGarantie): Observable<DocumentGarantie> {
        const copy = this.convert(documentGarantie);
        const options = createRequestOption();
        return this.http.post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(documentGarantie: DocumentGarantie): Observable<DocumentGarantie> {
        const copy = this.convert(documentGarantie);
        const options = createRequestOption();
        return this.http.put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<DocumentGarantie> {
        const options = createRequestOption(); return this.http.get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption(); return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
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
        entity.createdDate = this.dateUtils
            .convertLocalDateFromServer(entity.createdDate);
        entity.lastModifiedDate = this.dateUtils
            .convertLocalDateFromServer(entity.lastModifiedDate);
    }

    private convert(documentGarantie: DocumentGarantie): DocumentGarantie {
        const copy: DocumentGarantie = Object.assign({}, documentGarantie);
        copy.createdDate = this.dateUtils
            .convertLocalDateToServer(documentGarantie.createdDate);
        copy.lastModifiedDate = this.dateUtils
            .convertLocalDateToServer(documentGarantie.lastModifiedDate);
        return copy;
    }
}
