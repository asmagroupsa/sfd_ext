
import { EventBus } from '../../shared/model/functions';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { Rembt } from './rembt.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
@Injectable()
export class RembtService {
    private resourceUrl = HOST + '/api/rembts';
    private resourceSearchUrl = HOST + '/api/_search/rembts';

    private standAloneResourceUrl = HOST + '/api/stdalone/';
    private standAloneRembManuelUr = HOST + '/api/stdalone/remboursment-manuel';

    constructor(private http: Http, private dateUtils: JhiDateUtils) {}


    create_remb_manuel(req?: any) {
        const options = createRequestOption(req);
        //let agencesRef = UserData.getInstance().agencesReference.join(',');
        //options.params.set('agenceReference.in', agencesRef);
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => {
                         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);
                                  return Observable.throw(res);       })
            //.map((res: Response) => this.convertResponse(res));
            .map((res: Response) => res.json());
    }

    create(rembt: Rembt): Observable<Rembt> {
        const copy = this.convert(rembt);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(rembt: Rembt): Observable<Rembt> {
        const copy = this.convert(rembt);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<Rembt> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        let agencesRef = UserData.getInstance().agencesReference.join(',');
        options.params.set('agenceReference.in', agencesRef);
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
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.rembDate = this.dateUtils.convertLocalDateFromServer(
            entity.rembDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(rembt: Rembt): Rembt {
        const copy: Rembt = Object.assign({}, rembt);
        copy.rembDate = this.dateUtils.convertLocalDateToServer(rembt.rembDate);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            rembt.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            rembt.lastModifiedDate
        );
        return copy;
    }
}
