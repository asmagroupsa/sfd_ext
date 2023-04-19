import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { RemboursementSFD } from './remboursement-sfd.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class RemboursementSFDService {
    private resourceUrl = HOST + '/api/remboursement-sfds';
    private resourceSearchUrl = HOST + '/api/_search/remboursement-sfds';

    constructor(private http: Http, private dateUtils: JhiDateUtils) {}

    create(remboursementSFD: RemboursementSFD): Observable<RemboursementSFD> {
        const copy = this.convert(remboursementSFD);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(remboursementSFD: RemboursementSFD): Observable<RemboursementSFD> {
        const copy = this.convert(remboursementSFD);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<RemboursementSFD> {
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
        const options = createRequestOption(
            Object.assign({}, req, { NO_QUERY: true })
        );
        let sfdRef =
            UserData.getInstance().currentSfdReference ||
            UserData.getInstance().sfd;
        options.params.set('sfdReference.equals', sfdRef);
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
        entity.rembDate = this.dateUtils.convertLocalDateFromServer(
            entity.rembDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(remboursementSFD: RemboursementSFD): RemboursementSFD {
        const copy: RemboursementSFD = Object.assign({}, remboursementSFD);
        copy.rembDate = this.dateUtils.convertLocalDateToServer(
            remboursementSFD.rembDate
        );
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            remboursementSFD.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            remboursementSFD.lastModifiedDate
        );
        return copy;
    }
}
