import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { HttpClient } from 'selenium-webdriver/http';

import { createRequestOption, ResponseWrapper } from '../../shared';
import { EventBus, getUserRefOrChaineAgence } from '../../shared/model/functions';
import { HOST } from '../../shared/model/request-util';
import { CreditRequest } from './credit-request.model';
import { ValiderRevolving } from './valider-revolving.model';

@Injectable()
export class CreditRequestService {
    private resourceUrl = HOST + '/api/credit-requests';
    private resourceUrl2 = HOST + '/api/operation/enable-folder-revolving';
    private hasNotCreditRequestUrl = HOST + '/api/client/has-not-credit-request';
    private comitableUrl = HOST + '/api/client/liste-demande-produit-par-etape?etudierDetaille=true&etudierPrealable=true';
    private resourceSearchUrl = HOST + '/api/_search/credit-requests';
    private demandeDeCreditSheetUrl = HOST +
        '/api/report/client/fiche-demande-credit';
    private creditRequestMontantsUrl = HOST +
        '/api/client/detail-montant-demande-montant-credit';
    constructor(private http: Http, private dateUtils: JhiDateUtils) { }
    hasNotCreditRequest(clientId: any, produitId: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        options.params.set('client_id', clientId);
        options.params.set('produit_id', produitId);
        return this.http
            .get(this.hasNotCreditRequestUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    queryMontants(creditRequestId: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        options.params.set('credit_request_id', creditRequestId);
        return this.http
            .get(this.creditRequestMontantsUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    queryComitable(etat?: string, chaineAgences?: any[]): Observable<ResponseWrapper> {
        const options = createRequestOption();
        let params: string[] = getUserRefOrChaineAgence();
            if(params[0] == 'chaineAgence' && chaineAgences && chaineAgences.length){
               options.params.set(params[0], chaineAgences.join('*'));
            }else options.params.set(params[0], params[1]);
       if(etat)
        options.params.set('etat', etat);
        return this.http
            .get(this.comitableUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) => {
                    let jsonResponse = res.json();
                    /* if (idAgences && idAgences.length) {
                        jsonResponse = jsonResponse.filter((demande: any) => {
                            return chaineAgences.indexOf(demande.comity_id) != - 1;
                        });
                    } */
                    return new ResponseWrapper(res.headers, jsonResponse, res.status);
                });
    }

    doValidation(chainedossier, typeValide, montant, explanation, result, user_reference): Observable<ResponseWrapper> {
        const options = createRequestOption();
        return this.http
            .get(this.resourceUrl2 + '?chainedossier=' + chainedossier +'&typeValide=' + typeValide + '&montant=' + montant + '&explanation=' + explanation + '&result=' + result + '&user_reference=' + user_reference,
                 options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) => {
                    let jsonResponse = res.json();
                    /* if (idAgences && idAgences.length) {
                        jsonResponse = jsonResponse.filter((demande: any) => {
                            return chaineAgences.indexOf(demande.comity_id) != - 1;
                        });
                    } */
                    return new ResponseWrapper(res.headers, jsonResponse, res.status);
                });
    }

    create(creditRequest: CreditRequest): Observable<CreditRequest> {
        const copy = this.convert(creditRequest);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }


    update(creditRequest: CreditRequest): Observable<CreditRequest> {
        const copy = this.convert(creditRequest);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<CreditRequest> {
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
        entity.requestDate = this.dateUtils.convertLocalDateFromServer(
            entity.requestDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    convert(creditRequest: CreditRequest): CreditRequest {
        const copy: CreditRequest = Object.assign({}, creditRequest);
        copy.requestDate = this.dateUtils.convertLocalDateToServer(
            creditRequest.requestDate
        );
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            creditRequest.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            creditRequest.lastModifiedDate
        );
        return copy;
    }

    public demandeDeCredit(creditRequestId: number): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('credit_request_id', '' + creditRequestId);
        
        return this.http
            .get(this.demandeDeCreditSheetUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
}
