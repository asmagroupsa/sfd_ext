import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {HOST, createRequestOption} from './model/request-util';
import {Observable} from 'rxjs';
import {resultatOKFn} from './model/functions';

@Injectable()
export class SPSFDService {
    private _url = HOST + '/api/sfd/';

    constructor(private _http: Http) {}

    deleteCommityDossier(dossier_id: string|number): Observable<void> {
        const o = createRequestOption();
        o.params = o.params || new URLSearchParams();
        o.params.set('dossier_id', dossier_id.toString());

        return this._http.get(`${this._url}delete-commity-dossier`, o)
        .map(resultatOKFn);
    }

    annulationDecaissementCreditClient(credit_id: any) {
        return this._http
        .get(this._url + 'annulation-decaissement-credit-client', createRequestOption({credit_id}))
        .map(resultatOKFn).toPromise();
    }
}
