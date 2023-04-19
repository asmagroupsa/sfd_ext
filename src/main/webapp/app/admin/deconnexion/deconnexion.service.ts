
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { createRequestOption, HOST_MVN } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class JhiDeconnexionService {
    private url: string = HOST_MVN + '/api/user/deconnecter';
    private connectedUrl: string = HOST_MVN + '/api/user/deconnecter';
    constructor(private http: Http) {}

    getConnectedUsers(): Observable<any> {
        const options = createRequestOption();

        return this.http
            .get(`${this.connectedUrl}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => res.json());
    }
    deconnectUser(id): Observable<any> {
        const options = createRequestOption();
        return this.http
            .get(`${this.url}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => res.json());
    }
}
