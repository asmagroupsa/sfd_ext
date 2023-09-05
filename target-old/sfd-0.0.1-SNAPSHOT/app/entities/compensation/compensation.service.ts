import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, ResponseContentType } from '@angular/http';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { createRequestOption, ResponseWrapper, UserData } from '../../shared';
import { EventBus } from '../../shared/model/functions';
import { HOST } from '../../shared/model/request-util';
import { Compensation } from './compensation.model';
import { BankAccountClient } from '../bank-account-client/bank-account-client.model';

@Injectable()
export class CompensationService {
    private resourceUrl = HOST + '/api/compensations';
    private resourceSearchUrl = HOST + '/api/_search/compensations';
    private insertionOrdreVirementUrl = HOST + '/api/util/insertion-ordre-virement';
    private bank_account_url = HOST + '/api/bank-account-clients';
    private validationRequestCompensationUrl = HOST + '/api/fnm/validation-request-compensation';
    private validationRequestSTCompensationUrl = HOST + '/api/fnm/validation-request-sous-traitant-compensation';
    private detailsRequestCompensationUrl = HOST + "/api/util/detail-request-compensation-marchand";
    private emmetteurUrl = HOST + "/api/client/liste-emetteur";

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }
    ordreSheetPdf(req?: any): Observable<any> {
        const options = createRequestOption(req);
        options.params.set('acteur_reference', UserData.getInstance().currentSfdReference);
        options.params.set('file_type', '');
        options.params.set('qrcode', JSON.stringify({ type: 'SFD', reference: UserData.getInstance().getSFD().code }));
        options.responseType = ResponseContentType.Blob;
        return this.http
            .get(
                `${HOST}/api/report/ordre-virements-to-file`, options)
            .map((res: Response) => res);
    }
    detailsRequestCompensation(ids, type) {
        const options = createRequestOption();
        options.params.set('type_compensation', type || 'default');
        options.params.set('request_compensation_ids', `${ids}`);
        return this.http.get(this.detailsRequestCompensationUrl, options).map((res: Response) => res.json());
    }

    getAllEmetteur(id: number) {
        const options = createRequestOption();
        options.params.set('partner_id', id.toString());
        options.params.set('compteCarmesMaster', 'null');
        return this.http.get(this.emmetteurUrl, options).map((res: Response) => res.json());
    }

    validationRequestCompensation(ids, model, actor = 'm') {
        const options = createRequestOption();
        if (UserData.getInstance().isSousTraitant()) {
            options.params.set('cpte_compensateur', UserData.getInstance().account.login);
        }
        else {
            options.params.set('agence_reference', model.agence_reference);
        }
        // options.params.set('agence_reference', model.agence_reference);
        options.params.set('mode_paiement', model.modePaiement || '');
        options.params.set('numero_cheque', model.numerocheque || '');
        options.params.set('bank_libelle', model.bank_libelle || '');
        options.params.set('bankaccount', model.bankaccount || '');
        options.params.set('request_ids', `${ids}`);
        return this.http.get(actor === 'm' ? this.validationRequestCompensationUrl : this.validationRequestSTCompensationUrl, options).map((res: Response) => res.json());
    }
    insertionOrdreVirement(model) {
        const options = createRequestOption();
        options.params = new URLSearchParams;
        options.params.set('intitule_ordre', model.intituleOrdre);
        options.params.set('nom_beneficiaire', model.nomBeneficiaire);
        options.params.set('motif_paiement', model.motifPaiement);
        options.params.set('created_by', UserData.getInstance().userReference);
        options.params.set('bank_libelle', model.bank.libelle);
        options.params.set('agence_reference', model.agence_reference);
        options.params.set('acteur_reference', UserData.getInstance().currentSfdReference);
        options.params.set('numero_compt_beneficiaire', model.bankNumber);
        options.params.set('type_compensation', model.typecompensation);
        options.params.set('montant_virement', model.montantVirement);
        options.params.set('id', model.id);
        options.params.set('partner_id', model.partner_id);
        options.params.set('cpte_emetteur', model.cpte_emetteur);
        options.params.set('num_cpte_donneur_order', model.num_cpte_donneur_order);

        return this.http.get(this.insertionOrdreVirementUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => res.json());
    }
    operationCompensation(model) {
        const options = createRequestOption();
        options.params = new URLSearchParams;
        options.params.set('comptecarmes', model.comptecarmes);
        options.params.set('bankaccount', model.bankaccount);
        options.params.set('typecompensation', model.typecompensation);
        options.params.set('agence_reference', model.agence_reference);
        options.params.set('numerocheque', model.numerocheque);
        options.params.set('modePaiement', model.modePaiement);

        return this.http.get(`${HOST}/api/operation/compensation`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => res.json());
    }

    getAccountOrders(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption();

        options.params.set('numAccount.contains', '' + req);
        options.params.set('condition', '' + 'OR');
        return this.http.get(this.bank_account_url, options)
            .map((r) => new ResponseWrapper(r.headers, r.json(), r.status));
    }

    detailCompensation(idCompensation, typeCompensation) {
        const options = createRequestOption();
        options.params = new URLSearchParams;
        options.params.set('id_compensation', idCompensation);
        options.params.set('type_compensation', typeCompensation);

        return this.http.get(`${HOST}/api/util/detail-compensation`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => res.json());
    }
    detailOrdreVirement(ordreId, typeCompensation) {
        const options = createRequestOption();
        options.params = new URLSearchParams;
        options.params.set('ordre_id', ordreId);
        options.params.set('type_compensation', typeCompensation);

        return this.http.get(`${HOST}/api/util/detail-ordre-virement`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => res.json());
    }
    create(compensation: Compensation): Observable<Compensation> {
        const copy = this.convert(compensation);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(compensation: Compensation): Observable<Compensation> {
        const copy = this.convert(compensation);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<Compensation> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }
    findOrdreVirement(id: number): Observable<any> {
        const options = createRequestOption();
        return this.http
            .get(`${HOST}/api/ordre-virements/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
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
    getOrdreVirements(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(`${HOST}/api/ordre-virements`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
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
        entity.createdDate = Date.parse(entity.createdDate) ? new Date(entity.createdDate) : entity.createdDate;
        // entity.createdDate = this.dateUtils.convertLocalDateFromServer(entity.createdDate);
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(compensation: Compensation): Compensation {
        const copy: Compensation = Object.assign({}, compensation);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            compensation.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            compensation.lastModifiedDate
        );
        return copy;
    }

    verifierCompensation(params) {
        const options = createRequestOption();
        options.params = new URLSearchParams;
        options.params.set('comptecarmes', params.comptecarmes);
        options.params.set('typecompensation', params.typecompensation);

        if (UserData.getInstance().isSousTraitant()) {
            options.params.set('cpte_compensateur', UserData.getInstance().account.login);
        }
        else {
            options.params.set('agence_reference', params.agence_reference);
        }

        return this.http.get(`${HOST}/api/fnm/verifier-info-demande-compensation-marchand`, options)
            .toPromise()
            .then((r) => r.json());
    }

    verifierSoldeCompensation(params, acteur = '', partner_id) {
        const options = createRequestOption();
        options.params = new URLSearchParams;
        options.params.set('comptecarmes', params.comptecarmes);
        options.params.set('typecompensation', params.typecompensation);
        options.params.set('partner_id', partner_id);

        return this.http.get(`${HOST}/api/util/verifier-solde-compensation${acteur}`, options)
            .toPromise()
            .then((r) => r.json().resultat);
    }

    getBankAccountClientByNumAccount(numAccount: string): Promise<BankAccountClient> {
        const options = createRequestOption();
        options.params.set('numAccount.equals', numAccount);

        return this.http.get(this.bank_account_url, options)
            .map((r) => {
                const data = r.json()[0];

                if (!data) {
                    throw data;
                }

                return data;
            })
            .toPromise();
    }
}
