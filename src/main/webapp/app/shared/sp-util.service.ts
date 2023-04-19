import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { HOST, createRequestOption } from './model/request-util';
import { Observable } from 'rxjs';
import { resultatOKFn } from "./index";
import { UserData } from './model/singleton';

@Injectable()
export class SPUtilService {
    private _url = HOST + '/api/util/';

    constructor(private _http: Http) { }

    detailCommissionOperation(comptecarmes: string, type_compensation: string, acteur = '', partner_id): Observable<any[]> {
        const o = createRequestOption();
        o.params = o.params || new URLSearchParams();
        o.params.set('comptecarmes', comptecarmes);
        o.params.set('type_compensation', type_compensation);
        o.params.set('partner_id', partner_id);

        return this._http.get(`${this._url}detail-commission-operation${acteur}`, o)
            .map((r) => r.json());
    }

    listeCompteBankActeur(comptecarmes: string): Observable<any[]> {
        const o = createRequestOption();
        o.params = o.params || new URLSearchParams();
        o.params.set('comptecarmes', comptecarmes);

        return this._http.get(`${this._url}liste-compte-bank-acteur`, o)
            .map((r) => r.json());
    }

    soldeLigneCredit(ligne_credit_id: string): Observable<number> {
        const o = createRequestOption();
        o.params = o.params || new URLSearchParams();
        o.params.set('ligne_credit_id', ligne_credit_id);

        return this._http.get(`${this._url}solde-ligne-credit`, o)
            .map((r) => +r.json().resultat);
    }

    verifierRavip(ravip, recepisse) {
        return this._http.get(`${this._url}verifier-ravip`, createRequestOption({ ravip, recepisse }))
            .map(resultatOKFn).toPromise();
    }
}
