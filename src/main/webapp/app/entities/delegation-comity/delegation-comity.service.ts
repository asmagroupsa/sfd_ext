
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { DelegationComity } from './delegation-comity.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { UserData } from '../../shared/model/singleton';
import { Injectable } from '@angular/core';
@Injectable()
export class DelegationComityService {
    private resourceUrl = HOST + '/api/delegation-comities';
    private resourceSearchUrl = HOST + '/api/_search/delegation-comities';

    constructor(private http: Http) {}

    create(delegationComity: DelegationComity): Observable<DelegationComity> {
        const copy = this.convert(delegationComity);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return res.json();
            });
    }

    update(delegationComity: DelegationComity): Observable<DelegationComity> {
        const copy = this.convert(delegationComity);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return res.json();
            });
    }

    find(id: number): Observable<DelegationComity> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return res.json();
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(
            Object.assign({}, req, {
                NO_QUERY: true
            })
        );
        let sfd =
            UserData.getInstance().currentSfdReference ||
            UserData.getInstance().sfd;
        options.params.set('sfdReference.equals', sfd);
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
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(delegationComity: DelegationComity): DelegationComity {
        const copy: DelegationComity = Object.assign({}, delegationComity);
        return copy;
    }
}
