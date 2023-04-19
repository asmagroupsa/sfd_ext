
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { ZoneSfd } from './zone-sfd.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class ZoneSfdService {

    private resourceUrl = '/carmesfnmservice/api/zone-sfds';
    private resourceSearchUrl = '/carmesfnmservice/api/_search/zone-sfds';

    constructor(private http: Http) { }

    create(zoneSfd: ZoneSfd): Observable<ZoneSfd> {
        const copy = this.convert(zoneSfd);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(zoneSfd: ZoneSfd): Observable<ZoneSfd> {
        const copy = this.convert(zoneSfd);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<ZoneSfd> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
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
     * Convert a returned JSON object to ZoneSfd.
     */
    private convertItemFromServer(json: any): ZoneSfd {
        const entity: ZoneSfd = Object.assign(new ZoneSfd(), json);
        return entity;
    }

    /**
     * Convert a ZoneSfd to a JSON which can be sent to the server.
     */
    private convert(zoneSfd: ZoneSfd): ZoneSfd {
        const copy: ZoneSfd = Object.assign({}, zoneSfd);
        return copy;
    }
}
