import { Injectable } from '@angular/core';
import { Http, URLSearchParams, BaseRequestOptions, RequestOptionsArgs, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { CARMES_HOST } from './index';
import { CARMES_URL } from './model/request-util';

@Injectable()
export class CARMESService {
    private _url = CARMES_HOST + '/carte_puce';
    private _urlTransfert = CARMES_HOST + ':3000/monnaies/transfertCARMES';

    constructor(private _http: Http) { }

    getCARMESUserInfos(usrAccount: string): Observable<any> {
        const options = new BaseRequestOptions();
        options.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        options.headers.set('accept', 'application/json');

        const body = new URLSearchParams();
        body.set('action', "getUserID");
        body.set('usrAccount', usrAccount);

        return this._http
            .post(`${this._url}/appGetUserCompletId.php`, body.toString(), options)
            .map((res: any) => {
                let r = JSON.parse(`${res._body}`.trim());

                if ((typeof r.message.split) !== 'function') {
                    throw new Error('SPLIT_ERROR');
                }

                const t: string[] = r.message.split('*');

                if (t.length === 1) {
                    throw new Error(r.message);
                }

                return {
                    lastName: t[1],
                    firstName: t[2],
                    phoneNumber: t[9],
                    email: t[11],
                };
            });
    }

    checkMarchantCodeGuichetier(codeGuichet, pinClient, compteClient) {
        const options = new BaseRequestOptions();
        options.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        options.headers.set('accept', 'application/json');

        const body = new URLSearchParams();
        body.set('action', "guichetcarmes");
        body.set('compteClient', compteClient);
        body.set('codeGuichet', codeGuichet);
        body.set('pinClient', pinClient);

        return this._http
            .post(`${this._url}/appSms.php`, body.toString(), options)
            .map((res: any) => {
                let r = JSON.parse(`${res._body}`.trim());

                if (r.message !== 1) {
                    throw r;
                }
            }).toPromise();
    }

    transfertToOrder(compteAss, libelle, montant, compteClient) {
        const options = new BaseRequestOptions();
        // options.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        // options.headers.set('Content-Type', 'application/json');
        // options.headers.set('Access-Control-Allow-Origin', '*');

        const o = new RequestOptions();
        o.headers = new Headers();
        o.headers.set('content-type', 'application/json');

        // const body = new URLSearchParams();
        // body.set('compteCarmesExp', compteAss);
        // body.set('libelle', libelle);
        // body.set('compteCarmesDest', compteClient);
        // body.set('amount', montant);

        let data = {
            compteCarmesExp: compteAss,
            compteCarmesDest: compteClient,
            amount: montant,
            libelle: libelle
        }

        return this._http
            .post(this._urlTransfert, data, o)
            .map((res: any) => {
                const b = res.json();

                /* if (b && ((+b.erreur === 0) || (b.message === 'SOLDE SUFFISANT'))) {
                    return;
                } */
                

                if (b && b === "OK") {
                    return b;
                } else if (b === 'ERROR' || 'NO') {
                    throw `Erreur lors de la transaction`;
                }
            }).toPromise();
    }

    getEBusinessOperators() {
        return this._http
            .get(CARMES_URL + '/operateurs/get')
            .map((r) => r.json());
    }

    getEBusinessProduitByOperatorId(id) {
        return this._http
            .get(CARMES_URL + '/eoper_eproduit/getEprodByIdoperateur/' + id)
            .map((r) => r.json());
    }

    getEBusinessProduitByCatCode(code) {
        return this._http
            .get(CARMES_URL + '/eproduit/getByCodeCategorie/' + code)
            .map((r) => {
                let toFilter = r.json();
                return toFilter.filter(produit => produit.desactif == 0);
            });
    }

    eBusinessAddBeneficiary(body) {
        const o = new RequestOptions();
        o.headers = new Headers();
        o.headers.set('content-type', 'application/json');

        return this._http
            .post(CARMES_URL + '/beneficier/add', JSON.stringify(body), o)
            .map((r) => {
                const b = r.json()[0];

                /* if (b && ((+b.erreur === 0) || (b.message === 'SOLDE SUFFISANT'))) {
                    return;
                } */

                if (b && (parseInt(b.erreur) === 0 && b.resultat === "OK")) {
                    return;
                } else if (b.message === 'SOLDE INSUFFISANT' || b.message === 'SOLDE SUFFISANT') {
                    b.message = `Le solde CARMES d' un membre est insuffisant pour payer les frais d' assurance (${body.montant} FCFA)`;
                } else {
                    b.message = 'Erreur lors du paiement de l\'assurances des membres';
                }
                /* else if(b.erreur === 0 && b.resultat === 1) {
    
                } */

                throw b.message || b;
            });
    }

    getProduitByEbuisiness() {
        return this._http
            .get(CARMES_URL + '/eproduit/get/ASS-0001')
            .map((r) => {
                // let toFilter = r.json();
                return r.json();
            });
    }

}
