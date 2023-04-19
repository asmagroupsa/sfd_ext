import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { Operation } from './operation.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';

import { Injectable } from '@angular/core';
@Injectable()
export class OperationService {
    private resourceUrl = HOST + '/api/operations';
    private retraitUrl = HOST + '/api/client/retrait-local';
    private depotUrl = HOST + '/api/request/depot-local';
    private resourceSearchUrl = HOST + '/api/_search/operations';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }
    verifierSolde(compteInterne: string) {
        const options = createRequestOption();
        options.params = new URLSearchParams();
        options.params.set('compte', compteInterne + '');

        return this.http
            .get(`${HOST}/api/util/compte/solde`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .toPromise()
            .then((r) => r.json());
    }
    listeCreditTPE(comptecarmes) {
        const options = createRequestOption();
        options.params = new URLSearchParams();
        options.params.set('comptecarmes', comptecarmes + '');
        options.params.set('chaineAgence', UserData.getInstance().agencesReference.join('*'));

        return this.http
            .get(`${HOST}/api/client/liste-credit-tpe`, options)
            .toPromise()
            .then((r) => r.json());
    }

    operationLocalSFD(params, o: string) {
        const options = createRequestOption();
        options.params = new URLSearchParams();
        options.params.set('user_reference_guichetier', UserData.getInstance().userReference);
        options.params.set('compte_dav_client', params.compteClient);
        options.params.set('montant', params.montant);

        return this.http
            .get(HOST + '/api/operation/' + o + '-local-sfd', options)
            .map((r) => r.json().resultat);
    }

    listeCommissionsGuichetier(login: string) {
        const options = createRequestOption();
        options.params = new URLSearchParams();
        options.params.set('carmesAccount.equals', login);

        /* if (params) {
            if (params.start) {
                const d = params.start;
                options.params.set('date1', `${d.day}-${d.month}-${d.year}`);
            }

            if (params.end) {
                const d = params.end;
                options.params.set('date2', `${d.day}-${d.month}-${d.year}`);
            }
        } */

        return this.http
            .get(HOST + '/api/commissions', options)
            .map((r) => r.json());
    }
    listeOperationGuichetier(params?: { start: any, end: any }) {
        const options = createRequestOption();
        options.params = new URLSearchParams();
        options.params.set('user_reference_guichetier', UserData.getInstance().userReference);

        if (params) {
            if (params.start) {
                const d = params.start;
                options.params.set('date1', `${d.day}-${d.month}-${d.year}`);
            }

            if (params.end) {
                const d = params.end;
                options.params.set('date2', `${d.day}-${d.month}-${d.year}`);
            }
        }

        return this.http
            .get(HOST + '/api/operation/liste-operation-guichetier', options)
            .map((r) => r.json());
    }
    searchCompteByField(champ: string, critere: string) {
        const options = createRequestOption();
        options.params = new URLSearchParams();
        options.params.set('champ', champ);
        options.params.set('critere', critere);

        return this.http
            .get(HOST + '/api/client/search-compte-by-field', options)
            .map((r) => r.json());
    }

    alimentationGuichetSFD(params) {
        const options = createRequestOption();
        options.params = new URLSearchParams();
        options.params.set('user_reference_guichetier', params.userReferenceGuichetier);
        options.params.set('montant', params.montant);

        return this.http
            .get(HOST + '/api/operation/alimentation-guichet-sfd', options)
            .map((r) => r.json().resultat);
    }

    retraitLocal(params) {
        const options = createRequestOption();
        options.params = new URLSearchParams();
        options.params.set('compteClient', params.compteClient);
        options.params.set('montant', params.montant);

        return this.http
            .get(HOST + '/api/operation/retrait-local', options)
            .map((r) => r.json().resultat);
    }

    retraitTPE(params) {
        const options = createRequestOption();

        options.params = new URLSearchParams();
        options.params.set('comptecarmesAgent', params.cpte_carmes);
        options.params.set('montant', params.amount);

        return this.http
            .get(`${HOST}/api/operation/retrait-tpe`, options);
        //.map((r) => r.json().resultat)
        //.toPromise();
    }

    createDepotOrRetait(compte: string, montant: string, depot: boolean = false): Observable<any> {
        const options = createRequestOption();
        let url: string = depot ? this.depotUrl : this.retraitUrl;
        const params: URLSearchParams = new URLSearchParams();
        params.set('compteClient', compte);
        params.set('montant', montant);
        options.params = params;
        return this.http
            .get(url, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                return jsonResponse;
            });
    }
    create(operation: Operation): Observable<Operation> {
        const copy = this.convert(operation);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(operation: Operation): Observable<Operation> {
        const copy = this.convert(operation);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<Operation> {
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
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(operation: Operation): Operation {
        const copy: Operation = Object.assign({}, operation);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            operation.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            operation.lastModifiedDate
        );
        return copy;
    }
}
