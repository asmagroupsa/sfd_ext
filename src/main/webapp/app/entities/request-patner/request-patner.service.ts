import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { createRequestOption, LOCAL_FLAG, ResponseWrapper, UserData } from '../../shared';
import { EventBus } from '../../shared/model/functions';
import { HOST } from '../../shared/model/request-util';
import { RequestPartner, Partneriat } from './request-patner.model';

@Injectable()
export class RequestPartnerService {
    private requestPatnerUrl = HOST + '/api/cf-demande-partenariats';
    private partnaireUrl = HOST + '/api/partners';
    private partenariatUrl = HOST + '/api/cf-partenariats';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }


    create(produit: RequestPartner): Observable<RequestPartner> {
        const copy = this.convert(produit);
        const options = createRequestOption();
        return this.http
            .post(this.requestPatnerUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    createParteneriat(partneriat: Partneriat): Observable<Partneriat> {
        const copy = this.convert(partneriat);
        const options = createRequestOption();
        return this.http
            .post(this.partenariatUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(produit: RequestPartner): Observable<RequestPartner> {
        const copy = this.convert(produit);
        const options = createRequestOption();
        return this.http
            .put(this.requestPatnerUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<RequestPartner> {
        const options = createRequestOption();
        return this.http
            .get(`${this.requestPatnerUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(
            Object.assign({}, req, {
                NO_QUERY: true,
                'sfdReference.equals': UserData.getInstance().getSFD().code,
                // 'sfdReference.equals': UserData.getInstance().getSFDReference(),
            })
        );
        return this.http
            .get(this.requestPatnerUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return this.convertResponse(res);
            });
    }

    queryPartner(): Observable<ResponseWrapper> {
        const options = createRequestOption(
            Object.assign({}, {
                NO_QUERY: true,
                //'sfdReference.equals': UserData.getInstance().getSFD().code,
                // 'sfdReference.equals': UserData.getInstance().getSFDReference(),
            })
        );
        return this.http
            .get(this.partnaireUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return this.convertResponse(res);
            });
    }


    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.requestPatnerUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.createdDate = entity.createdDate;
        /*entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );*/
        /* entity.createdDate = {
             year: entity.createdDate[0],
             month: entity.createdDate[1],
             day: entity.createdDate[2]*/
        // };
        // entity.lastModifiedDate = {
        //   year:entity.lastModifiedDate[0],
        //   month:entity.lastModifiedDate[1],
        //   day:entity.lastModifiedDate[2]
        //};
    }

    private convert(produit: RequestPartner): RequestPartner {
        const copy: RequestPartner = Object.assign({}, produit);
        copy.createdDate = produit.createdDate;
        return copy;
    }
}
