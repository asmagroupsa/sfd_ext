import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { ServiceUser } from './service-user.model';
import { ResponseWrapper, createRequestOption, HOST_MVN } from '../../shared';
import { UserData } from '../../shared/model/singleton';
import { Injectable } from '@angular/core';
@Injectable()
export class ServiceUserService {
    private resourceUrl = HOST + '/api/service-users';
    private sfdAgencesUrl = HOST_MVN + '/api/user/liste-utilisateurs-sfd';
    private resourceSearchUrl = HOST + '/api/_search/service-users';
    private usersForSFDUrl: string = HOST + '/api/service-users';

    constructor(private http: Http, private dateUtils: JhiDateUtils) {}

    create(serviceUser: ServiceUser): Observable<ServiceUser> {
        const copy = this.convert(serviceUser);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(serviceUser: ServiceUser): Observable<ServiceUser> {
        const copy = this.convert(serviceUser);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<ServiceUser> {
        const options = createRequestOption();
        let sfdRef =
            UserData.getInstance().currentSfdReference ||
            UserData.getInstance().sfd;
        options.params.set('sfdReference.equals', sfdRef);
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    usersForSFD(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        let sfdRef =
            UserData.getInstance().currentSfdReference ||
            UserData.getInstance().sfd;
        options.params.set('sfdReference.equals', sfdRef);
        return this.http
            .get(this.usersForSFDUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => this.convertResponse(res));
    }
    query(req?: any, s = false): Observable<ResponseWrapper> {
        let sfdRef =
            UserData.getInstance().currentSfdReference ||
            UserData.getInstance().sfd;
        const options = createRequestOption();
        options.params.set('sfd_reference', sfdRef);
        return this.http
            .get(this.sfdAgencesUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                return this.convertResponse(res);
            });
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
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(serviceUser: ServiceUser): ServiceUser {
        const copy: ServiceUser = Object.assign({}, serviceUser);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            serviceUser.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            serviceUser.lastModifiedDate
        );
        return copy;
    }
}
