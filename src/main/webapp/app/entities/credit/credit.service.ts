import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { Credit } from './credit.model';
import { ResponseWrapper, createRequestOption, UserData, getUserRefOrChaineAgence } from '../../shared';
import {
    searchRessource,
    nameSFD,
    nameZoneAgence,
    nameAgence
} from '../../shared/model/functions';
import { Injectable } from '@angular/core';
@Injectable()
export class CreditService {
    private sfdValideLigneUrl: string = HOST +
        '/api/sfd/liste-ligne-credit-disponible';
    private resourceUrl = HOST + '/api/credits';
    private compteUrl = HOST + '/api/client/liste-compte';
    private creditUrl = HOST + '/api/client/liste-credits';
    private printUrl = HOST + '/api/client/print-contrat';
    private suffisantUrl = HOST + '/api/util/ligne-credit-suffisant';
    private decaissementUrl = HOST + '/api/operation/decaissement';
    private resourceSearchUrl = HOST + '/api/_search/credits';
    private approbationSheetUrl = HOST +
        '/api/report/client/fiche-approbation-credit';
    private ficheOrdreUrl = HOST +
        '/api/report/client/report-fiche-client-groupe';
    private creditAccordUrl = HOST + '/api/sfd/accord-credit';
    private listeEncoursUrl = HOST + '/api/report/client/liste-encours-credits';
    private payementPenaliteUrl = HOST + '/api/operation/payement-penalite';
    private RetrancheCreditUrl = HOST + '/api/retranche-credits';
    private ListAssuranceOption = HOST + '/api/options';
    private TarifAssuranceUrl = HOST + '/api/assurance/liste-individu-group-assurance-etat';



    private creditEnPerteUrl = HOST + '/api/sfd/liste-creditenretard-partype?type=perte';
    private creditEnSouffranceUrl = HOST + '/api/sfd/liste-creditenretard-partype?type=souffrance';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    public approbationSheet(creditId: number): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('credit_id', '' + creditId);
        
        return this.http
            .get(this.approbationSheetUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }

    printContrat(creditId: any) {
        const options = createRequestOption();
        
        options.params.set('credit_id', '' + creditId);
        
        return this.http
            .get(this.printUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }


    getAssuranceOption(): Observable<ResponseWrapper> {
        const options = createRequestOption();
        return this.http
            .get(this.ListAssuranceOption, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }

    getTarifAssurance(creditId: any, optionId) {
        const options = createRequestOption();
        
        options.params.set('credit_id', '' + creditId);
        options.params.set('option_id', '' + optionId);
        
        return this.http
            .get(this.TarifAssuranceUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }

    queryCompte(notifId: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('notification_id', notifId);
        options.params.set('typecompte_id', '3');
        
        return this.http
            .get(this.compteUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    querySFDValideLigne(montantcredit: number): Observable<ResponseWrapper> {
        const options = createRequestOption();
        let sfdRef =
            UserData.getInstance().currentSfdReference ||
            UserData.getInstance().sfd;
        options.params.set('sfd_reference', sfdRef);
        options.params.set('montant', '' + montantcredit);
        return this.http
            .get(this.sfdValideLigneUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    ligneSuffisant(idligne: number, montantcredit: number): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('montantcredit', '' + montantcredit);
        options.params.set('idligne', '' + idligne);
        
        return this.http
            .get(this.suffisantUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    listeEncoursCredit(date: string) {
        const options = createRequestOption();
        
        options.params.set('datee', '' + date);
        let param = getUserRefOrChaineAgence();
        options.params.set(param[0], param[1]);
        
        return this.http
            .get(this.listeEncoursUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json().map((c) => {
                        if (c.dateCredit && !isNaN(Date.parse(c.dateCredit))) {
                            c.dateCredit = new Date(c.dateCredit);
                        }

                        return c;
                    }), res.status)
            );
    }
    payerPenalite(creditId: string, name: string, montant: string): Observable<any> {
        const options = createRequestOption();
        
        let userReference: string = UserData.getInstance().userReference;
        options.params.set('user_reference_guichetier', userReference);
        options.params.set('montant', montant);
        options.params.set('credit_id', creditId);
        options.params.set('name', name);
        
        return this.http
            .get(this.payementPenaliteUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    decaisser(creditId: number, optionId, tarif) {
        const options = createRequestOption();
        
        options.params.set('credit_id', '' + creditId);
        options.params.set('option_id', '' + optionId);
        options.params.set('tarif', '' + tarif);

        
        return this.http
            .get(this.decaissementUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const resultat = res.json().resultat;
                const solde = +resultat;

                if (!isNaN(solde)) {
                    return solde;
                }

                throw resultat;
            });
    }
    accordCredit(params: any): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('amount', '' + params.amount);
        options.params.set('created_by', params.created_by || params.createdBy);
        options.params.set('notification_client_id', '' + params.notification_client_id);
        options.params.set('ligne_credit_id', '' + params.ligne_credit_id);
        options.params.set('mode_echeance', '' + params.mode_echeance);
        options.params.set('agence_reference', '' + params.agence_reference);
        options.params.set('differe', '' + params.differe);
        options.params.set('delaiGrace', '' + params.delaiGrace);
        options.params.set('num_account', params.num_account);
        options.params.set('file_path', params.file_path || '');
        
        return this.http
            .get(this.creditAccordUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                return jsonResponse;
            });
    }
    create(credit: Credit): Observable<Credit> {
        const copy = this.convert(credit);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(credit: Credit): Observable<Credit> {
        const copy = this.convert(credit);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<Credit> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    queryCredits(flag: boolean = false, req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption({ NO_QUERY: true, ...req });
        // 
        // options.params.set('decaisse', '' + flag);

        let param = getUserRefOrChaineAgence();
        options.params.set(param[0], param[1]);
        options.params.set('decaisse', '' + flag);
        return this.http
            .get(this.creditUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
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
        /* entity.creditDate = this.dateUtils.convertLocalDateFromServer(
      entity.creditDate
    ); */
        entity.startDate = this.dateUtils.convertLocalDateFromServer(
            entity.startDate
        );
        entity.endDate = this.dateUtils.convertLocalDateFromServer(
            entity.endDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(credit: Credit): Credit {
        const copy: Credit = Object.assign({}, credit);
        /* copy.creditDate = this.dateUtils.convertLocalDateToServer(
      credit.creditDate
    ); */
        copy.startDate = this.dateUtils.convertLocalDateToServer(
            credit.startDate
        );
        copy.endDate = this.dateUtils.convertLocalDateToServer(credit.endDate);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            credit.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            credit.lastModifiedDate
        );
        return copy;
    }

    public loanAgreement(creditId: number): Promise<any> {
        return this.http
            .get(
                `${HOST}/api/report/client/fiche-contrat-pret/?credit_id=${creditId}`,
                createRequestOption()
            )
            .toPromise()
            .then((res: any) => res.json()[0]);
    }

    public loanAgreementSt(clientId, sfd_reference): Promise<any> {
            return this.http
            .get(
                `${HOST}/api/sfd/fiche-contrat/sous-traitant/?id_client=${clientId}&sfd_reference=${sfd_reference}`,
                createRequestOption()
            )
            .toPromise()
            .then((res: any) => res.json());
    }

    showFicheOrdre(id: number): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('credit_id', '' + id);
        
        return this.http
            .get(this.ficheOrdreUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return res.json();
            });
    }

    retranchesByCreditId(id: number): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('creditId.equals', '' + id);
        
        return this.http
            .get(this.RetrancheCreditUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return res.json();
            });
    }

    getPerteCreditListBySFD(sfd_id:number): Observable<any> {
        console.log(`&sfd_id=${sfd_id}`);
        console.log(this.creditEnPerteUrl + `&sfd_id=${sfd_id}`);

        return this.http
            .get(this.creditEnPerteUrl + `&sfd_id=${sfd_id}`)
            .catch((res: Response) => {
             if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return res.json();
            });
    }

    getSouffranceCreditListBySFD(sfd_id:number): Observable<any> {
        return this.http
            .get(this.creditEnSouffranceUrl + `&sfd_id=${sfd_id}`)
            .catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return res.json();
            });
    }

}
