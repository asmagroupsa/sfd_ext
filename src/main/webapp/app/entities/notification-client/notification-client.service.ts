import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { createRequestOption, ResponseWrapper } from '../../shared';
import { EventBus, getUserRefOrChaineAgence } from '../../shared/model/functions';
import { HOST } from '../../shared/model/request-util';
import { NotificationClient } from './notification-client.model';

@Injectable()
export class NotificationClientService {
    private resourceUrl = HOST + '/api/notification-clients';
    private notificationsUrl = HOST +
        '/api/client/liste-notification?formable=false';
    private nonDebloquerUrl = HOST +
        '/api/client/liste-notification-client-non-debloquer';
    private notifierUrl = HOST + '/api/client/liste-demande-produit-par-etape';
    private resourceSearchUrl = HOST + '/api/_search/notification-clients';
    private formableNonFormerUrl = HOST +
        '/api/client/liste-notification-formable-non-former';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    queryNonDebloquer(): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        
        let params = getUserRefOrChaineAgence();
        options.params.set(params[0], params[1]);
        return this.http
            .get(this.nonDebloquerUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) => {
                    let jsonRes = res.json();
                    jsonRes.sort((a, b) => {
                        return b.id - a.id;
                    });
                    return new ResponseWrapper(res.headers, jsonRes, res.status);
                }
            );
    }

    queryNotification(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        let params = getUserRefOrChaineAgence();
        if (!params[1]) {
            return Observable.create(observer => {
                observer.error(new ResponseWrapper(null, {}, 400));
            });
        }
        options.params.set(params[0], params[1]);
        return this.http
            .get(this.formableNonFormerUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) => {
                    let jsonRes = res.json();
                    jsonRes.sort((a, b) => {
                        return b.id - a.id;
                    });
                    return new ResponseWrapper(res.headers, jsonRes, res.status)
                });
    }
    create(
        notificationClient: NotificationClient
    ): Observable<NotificationClient> {
        const copy = this.convert(notificationClient);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(
        notificationClient: NotificationClient
    ): Observable<NotificationClient> {
        const copy = this.convert(notificationClient);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<NotificationClient> {
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
        const options = createRequestOption(req);
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
        entity.notificationDate = this.dateUtils.convertLocalDateFromServer(
            entity.notificationDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(
        notificationClient: NotificationClient
    ): NotificationClient {
        const copy: NotificationClient = Object.assign({}, notificationClient);
        copy.notificationDate = this.dateUtils.convertLocalDateToServer(
            notificationClient.notificationDate
        );
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            notificationClient.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            notificationClient.lastModifiedDate
        );
        return copy;
    }

    public ficheNotificationCredit(notificationId: number): Observable<any> {
        return this.http
            .get(
                `${HOST}/api/report/client/fiche-notification-credit/?notification_id=${notificationId}`,
                createRequestOption()
            )
            .map((res: Response) => res.json()[0]);
    }
}
