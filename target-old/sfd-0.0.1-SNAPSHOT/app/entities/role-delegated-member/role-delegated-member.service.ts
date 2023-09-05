import {HOST} from '../../shared/model/request-util';
import {EventBus} from '../../shared/model/functions';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {ResponseWrapper, createRequestOption} from '../../shared';
import {Injectable} from '@angular/core';

@Injectable()
export class RoleDelegatedMemberService {
    private resourceUrl = `${HOST}/api/role-delegated-members`;

    constructor(private http: Http) {}

    /* find(id: number): Observable<TauxSFD> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res);})
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    } */

    query(req?: any): Observable<ResponseWrapper> {
        return this.http.get(this.resourceUrl, createRequestOption(req))
        .catch((res: Response) => {
            if (res.status == 401) {
                EventBus.publish('NOT_AUTHORIZED', true);
                return Observable.throw(res);
            }
        })
        .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }
}
