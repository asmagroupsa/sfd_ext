
import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { Assurance } from './assurance.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { Injectable } from '@angular/core';
@Injectable()
export class AssuranceService {
    private resourceUrl = HOST + '/api/beneficiaires';
    private clientAssureUrl = HOST + '/api/sfd/liste-client-assures';
    private resourceSearchUrl = HOST + '/api/_search/beneficiaires';
    private listAyantDroit = HOST + '/api/assurance/liste-ayant-droit';
    private AssuranceInfos = HOST + '/api/assurance/infos';
    private sinistreURL = HOST + '/api/sinistres';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(assurance: Assurance): Observable<Assurance> {
        const copy = this.convert(assurance);
        const options = createRequestOption();
        return this.http.post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }


    update(address: Assurance): Observable<Assurance> {
        const copy = this.convert(address);
        const options = createRequestOption();
        return this.http.put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    getAyantDroit(numPolice): Observable<ResponseWrapper> {
        const options = createRequestOption();
        const urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('num_police', '' + numPolice);
        options.params = urlParams;
        return this.http
            .get(this.listAyantDroit, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {return res.json()});
    }

    getAllSinistre(): Observable<ResponseWrapper> {
        const options = createRequestOption();
        const urlParams: URLSearchParams = new URLSearchParams();
        // urlParams.set('num_police', '' + numPolice);
        options.params = urlParams;
        return this.http
            .get(this.sinistreURL, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {return res.json()});
    }

    getContratInformation(numPolice) {
        const options = createRequestOption();
        const urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('num_police', '' + numPolice);
        options.params = urlParams;
        return this.http
            .get(this.AssuranceInfos, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {return res.json()});
    }

    getAllBeneficiaryByClient(id) {
        const options = createRequestOption();
        const urlParams: URLSearchParams = new URLSearchParams();
        urlParams.set('clientId.equals', id + '');
        options.params = urlParams;
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }

    find(id: number): Observable<Assurance> {
        const options = createRequestOption(); return this.http.get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.clientAssureUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption(); return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        console.log(res);
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

    private convert(assurance: Assurance): Assurance {
        const copy: Assurance = Object.assign({}, assurance);
        copy.dateNaissance = this.dateUtils.convertLocalDateToServer(
            assurance.dateNaissance
        );
        return copy;
    }
}
