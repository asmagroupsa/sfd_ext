
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { ZoneDepartement } from './zone-departement.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class ZoneDepartementService {

    private resourceUrl = '/carmesfnmservice/api/zone-departements';
    private resourceSearchUrl = '/carmesfnmservice/api/_search/zone-departements';

    constructor(private http: Http) { }

    create(zoneDepartement: ZoneDepartement): Observable<ZoneDepartement> {
        const copy = this.convert(zoneDepartement);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(zoneDepartement: ZoneDepartement): Observable<ZoneDepartement> {
        const copy = this.convert(zoneDepartement);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<ZoneDepartement> {
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
     * Convert a returned JSON object to ZoneDepartement.
     */
    private convertItemFromServer(json: any): ZoneDepartement {
        const entity: ZoneDepartement = Object.assign(new ZoneDepartement(), json);
        return entity;
    }

    /**
     * Convert a ZoneDepartement to a JSON which can be sent to the server.
     */
    private convert(zoneDepartement: ZoneDepartement): ZoneDepartement {
        const copy: ZoneDepartement = Object.assign({}, zoneDepartement);
        return copy;
    }
}
