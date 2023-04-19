import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { RembtPenalSFD } from './rembt-penal-sfd.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { UserData } from '../../shared/model/singleton';
import { Injectable } from '@angular/core';
@Injectable()
export class RembtPenalSFDService {
    private resourceUrl = HOST + '/api/rembt-penal-sfds';
    private resourceSearchUrl = HOST + '/api/_search/rembt-penal-sfds';

    constructor(private http: Http, private dateUtils: JhiDateUtils) {}

    create(rembtPenalSFD: RembtPenalSFD): Observable<RembtPenalSFD> {
        const copy = this.convert(rembtPenalSFD);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(rembtPenalSFD: RembtPenalSFD): Observable<RembtPenalSFD> {
        const copy = this.convert(rembtPenalSFD);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<RembtPenalSFD> {
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
        entity.rembPenalDate = this.dateUtils.convertLocalDateFromServer(
            entity.rembPenalDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(rembtPenalSFD: RembtPenalSFD): RembtPenalSFD {
        const copy: RembtPenalSFD = Object.assign({}, rembtPenalSFD);
        copy.rembPenalDate = this.dateUtils.convertLocalDateToServer(
            rembtPenalSFD.rembPenalDate
        );
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            rembtPenalSFD.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            rembtPenalSFD.lastModifiedDate
        );
        return copy;
    }
}
