import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {HOST, createRequestOption} from './model/request-util';
import {Observable} from 'rxjs';

@Injectable()
export class SPOperationService {
    private _url = HOST + '/api/operation/';

    constructor(private _http: Http) {}

    listeOperation(params) {
        return this._http
        .get(this._url + 'liste-operation', createRequestOption(params))
        .map((r) => r.json());
    }
}
