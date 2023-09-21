import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { ComityMber } from './comity-mber.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { UserData } from '../../shared/model/singleton';
import { Injectable } from '@angular/core';
@Injectable()
export class ComityMberService {
    private resourceUrl = HOST + '/api/comity-mbers';
    private resourceSearchUrl = HOST + '/api/_search/comity-mbers';

    constructor(private http: Http, private dateUtils: JhiDateUtils) {}

    create(comityMber: ComityMber): Observable<ComityMber> {
        const copy = this.convert(comityMber);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(comityMber: ComityMber): Observable<ComityMber> {
        const copy = this.convert(comityMber);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<ComityMber> {
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
        const options = createRequestOption(req);
        options.params.set(
            'sfdReference.equals',
            UserData.getInstance().currentSfdReference ||
                UserData.getInstance().sfd
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
        entity.nominationDate = this.dateUtils.convertLocalDateFromServer(
            entity.nominationDate
        );
        entity.endNominationDate = this.dateUtils.convertLocalDateFromServer(
            entity.endNominationDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(comityMber: ComityMber): ComityMber {
        const copy: ComityMber = Object.assign({}, comityMber);
        copy.nominationDate = this.dateUtils.convertLocalDateToServer(
            comityMber.nominationDate
        );
        copy.endNominationDate = this.dateUtils.convertLocalDateToServer(
            comityMber.endNominationDate
        );
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            comityMber.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            comityMber.lastModifiedDate
        );
        return copy;
    }
}
