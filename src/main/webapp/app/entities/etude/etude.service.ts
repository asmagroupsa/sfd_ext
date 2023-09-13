
import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { Etude } from './etude.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import {
    getUserRefOrChaineAgence
} from '../../shared/model/functions';
import { Injectable } from '@angular/core';
@Injectable()
export class EtudeService {
    private resourceUrl = HOST + '/api/etudes';
    private etudeDetailleUrl = HOST + '/api/client/liste-etudes';
    private etudePrealableUrl = HOST + '/api/client/liste-etudes';
    private detaillerUrl = HOST + '/api/client/liste-demande-produit-par-etape';
    private prealableUrl = HOST + '/api/client/liste-demande-produit-par-etape';
    private resourceSearchUrl = HOST + '/api/_search/etudes';
    private montantEtudeUrl = HOST +
        '/api/util/credit-request-montant-par-etape';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }
    queryMontant(creditId: any, etape: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('credit_request_id', creditId);
        options.params.set('etape', etape);
        
        return this.http
            .get(this.montantEtudeUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    queryRevolving(): Observable<ResponseWrapper> {
        const options = createRequestOption();
        let params = getUserRefOrChaineAgence();
        options.params.set(params[0], params[1]);
        options.params.set('typ', 'revolving');
        return this.http
            .get(this.etudeDetailleUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    queryEtudeDetaillee(): Observable<ResponseWrapper> {
        const options = createRequestOption();
        let params = getUserRefOrChaineAgence();
        options.params.set(params[0], params[1]);
        options.params.set('typ', 'detaillee');
        return this.http
            .get(this.etudeDetailleUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    queryEtudePrealable(): Observable<ResponseWrapper> {
        const options = createRequestOption();
        let params = getUserRefOrChaineAgence();
        options.params.set(params[0], params[1]);
        options.params.set('typ', 'prealable');
        return this.http
            .get(this.etudePrealableUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    queryDetailler(flag: string = 'true'): Observable<ResponseWrapper> {
        const options = createRequestOption();
        let params = getUserRefOrChaineAgence();
        options.params.set(params[0], params[1]);
        options.params.set('etudierDetaille', flag);
        return this.http
            .get(this.detaillerUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    queryPrealable(
        flag: string = 'true',
        all?: boolean
    ): Observable<ResponseWrapper> {
        const options = createRequestOption();
        if (!all) {
            let params = getUserRefOrChaineAgence();
            options.params.set(params[0], params[1]);
            options.params.set('etudierPrealable', flag);
        }
        /* options.params.set('comiter', 'false');
        options.params.set('etudierDetaille', 'false');
        options.params.set('notifier', 'false');
        options.params.set('garantisser', 'false');
        options.params.set('former', 'false'); */
        return this.http
            .get(this.prealableUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    create(etude: Etude): Observable<Etude> {
        const copy = this.convert(etude);
        const options = createRequestOption();

        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(etude: Etude): Observable<Etude> {
        const copy = this.convert(etude);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<Etude> {
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
        entity.visitDate = this.dateUtils.convertLocalDateFromServer(
            entity.visitDate
        );
        entity.etudeDate = this.dateUtils.convertLocalDateFromServer(
            entity.etudeDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(etude: Etude): Etude {
        const copy: Etude = Object.assign({}, etude);
        copy.visitDate = this.dateUtils.convertLocalDateToServer(
            etude.visitDate
        );
        copy.etudeDate = this.dateUtils.convertLocalDateToServer(
            etude.etudeDate
        );
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            etude.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            etude.lastModifiedDate
        );
        return copy;
    }

    public procesEtude(creditRequestId: number): Promise<any> {
        return this.http
            .get(
                `${HOST}/api/report/client/fiche-proces-etude/?credit_request_id=${creditRequestId}`,
                createRequestOption()
            )
            .toPromise()
            .then((res: any) => res.json()[0]);
    }
}
