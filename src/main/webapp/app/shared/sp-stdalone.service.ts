import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HOST, createRequestOption} from './model/request-util';

@Injectable()
export class SPStdAloneService {
    private _url = HOST + '/api/stdalone/';

    constructor(private _http: Http) {}

    transfertBankCoffre(params: TransfertBankCoffreParams): Promise<void> {
        return this._http.get(this._url + 'transfert-bank-coffre', createRequestOption({
            NO_QUERY: true,
            ...params,
        }))
        .map((r) => {
            const resultat = r.json().resultat;

            if (resultat !== 'OK') {
                throw resultat;
            }
        })
        .toPromise();
    }

    transfertCaisse(params: TransfertCaisseParams): Promise<void> {
        return this._http.get(this._url + 'transfert-caisse', createRequestOption({
            NO_QUERY: true,
            ...params,
        }))
        .map((r) => {
            const resultat = r.json().resultat;

            if (resultat !== 'OK') {
                throw resultat;
            }
        })
        .toPromise();
    }
}

export type TransfertBankCoffreParams = {
    coffre_id?: number;
    montant?: number;
    bank_id?: number;
    num_compte_bank?: string;
    depart?: 'BANK' | 'COFFRE';
};

export type TransfertCaisseParams = {
    caisse_from_id?: number;
    caisse_to_id?: number;
    montant?: number;
};
