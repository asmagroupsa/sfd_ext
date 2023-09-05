import {Injectable} from '@angular/core';
import {HOST, createRequestOption} from './model/request-util';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class SPClientService {
    private _url = `${HOST}/api/client/`;

    constructor(private http: Http) {}

    syntheseCreditComity(credit_comity_id): Observable<any> {
        const options = createRequestOption();
        options.params = new URLSearchParams();
        options.params.set('credit_comity_id', credit_comity_id);

        return this.http.get(`${this._url}synthese-credit-comity`, options)
        .map((r) => {
            const json = r.json();

            if (!Array.isArray(json)) {
                throw new Error('NOT_ARRAY');
            }
            
            const synthesis = json[0];
            
            if (!synthesis) {
                throw new Error('NOT_FOUND');
            }

            return synthesis;
        });
    }

    dissoudreGroupe(queryParams) {
        return this.http.get(`${this._url}dissoudre-groupe`, createRequestOption({
            ...queryParams,
            NO_QUERY: true,
        }))
        .map((r) => {
            const resultat = r.json().resultat;

            if (resultat === 'OK') {
                return;
            }

            throw resultat;
        })
        .toPromise();
    }
}
