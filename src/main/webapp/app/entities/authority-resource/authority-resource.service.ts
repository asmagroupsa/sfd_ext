
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AuthorityResource } from './authority-resource.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class AuthorityResourceService {

    private resourceUrl = 'api/authority-resources';
    private resourceSearchUrl = 'api/_search/authority-resources';

    constructor(private http: Http) { }

    create(authorityResource: AuthorityResource): Observable<AuthorityResource> {
        const copy = this.convert(authorityResource);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(authorityResource: AuthorityResource): Observable<AuthorityResource> {
        const copy = this.convert(authorityResource);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<AuthorityResource> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
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
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(authorityResource: AuthorityResource): AuthorityResource {
        const copy: AuthorityResource = Object.assign({}, authorityResource);
        return copy;
    }
}
