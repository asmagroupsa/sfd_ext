
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { ZoneAgence } from './zone-agence.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
@Injectable()
export class ZoneAgenceService {
    private resourceUrl = HOST + '/api/zone-agences';
    private resourceSearchUrl = HOST + '/api/_search/zone-agences';

    constructor(private http: Http) { }

    create(zoneAgence: ZoneAgence): Observable<ZoneAgence> {
        const copy = this.convert(zoneAgence);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                return this.convertItemFromServer(jsonResponse);
            });
    }

    update(zoneAgence: ZoneAgence): Observable<ZoneAgence> {
        const copy = this.convert(zoneAgence);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                return this.convertItemFromServer(jsonResponse);
            });
    }

    find(id: number): Observable<ZoneAgence> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                return this.convertItemFromServer(jsonResponse);
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        if (req && !req.hasOwnProperty('size')) {
            req.size = 1000;
        }
        const options = createRequestOption(
            Object.assign({}, req, { NO_QUERY: true })
        );
        options.params.set('sfdId.equals', '' + UserData.getInstance().sfdId);
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
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to ZoneAgence.
     */
    private convertItemFromServer(json: any): ZoneAgence {
        const entity: ZoneAgence = Object.assign(new ZoneAgence(), json);
        return entity;
    }

    /**
     * Convert a ZoneAgence to a JSON which can be sent to the server.
     */
    private convert(zoneAgence: ZoneAgence): ZoneAgence {
        const copy: ZoneAgence = Object.assign({}, zoneAgence);
        return copy;
    }
}
