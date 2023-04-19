import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HOST, createRequestOption} from './model/request-util';
import {resultatOKFn} from './model/functions';
import {UserData, HOST_MVN} from "./index";

@Injectable()
export class MVNService {
    constructor(private _http: Http) {}

    souscriptionComplet(queryParams) {
        return this._http.get(
            this._url('/api/user/souscription-complet'),
            createRequestOption({
                NO_QUERY: true,
                typeclient: 'SOUS_TRAITANT',
                ...queryParams,
            })
        ).map(resultatOKFn).toPromise();
    }

    private _url(path) {
        return HOST_MVN + path;
    }
}
