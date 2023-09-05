
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { RembtPenal } from './rembt-penal.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { UserData } from '../../shared/model/singleton';
import { Injectable } from '@angular/core';
@Injectable()
export class RembtPenalService {
    private resourceUrl = HOST + '/api/rembt-penals';
    private resourceSearchUrl = HOST + '/api/_search/rembt-penals';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(rembtPenal: RembtPenal): Observable<RembtPenal> {
        const copy = this.convert(rembtPenal);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(rembtPenal: RembtPenal): Observable<RembtPenal> {
        const copy = this.convert(rembtPenal);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<RembtPenal> {
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
        const options = createRequestOption(
            Object.assign({}, req, { NO_QUERY: true })
        );
        let agencesRef = UserData.getInstance().agencesReference.join(',');
        options.params.set('agenceReference.in', agencesRef);
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

    private convert(rembtPenal: RembtPenal): RembtPenal {
        const copy: RembtPenal = Object.assign({}, rembtPenal);
        copy.rembPenalDate = this.dateUtils.convertLocalDateToServer(
            rembtPenal.rembPenalDate
        );
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            rembtPenal.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            rembtPenal.lastModifiedDate
        );
        return copy;
    }
}
