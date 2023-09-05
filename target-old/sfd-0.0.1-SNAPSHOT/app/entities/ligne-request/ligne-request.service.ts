import { HOST } from '../../shared/model/request-util';

import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { LigneRequest } from './ligne-request.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { Injectable } from '@angular/core';
@Injectable()
export class LigneRequestService {
    private resourceUrl = HOST + '/api/ligne-requests';
    private resourceSearchUrl = HOST + '/api/_search/ligne-requests';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    comityMontantDossier(creditComitiesId: string) {
        const options = createRequestOption();
        options.params = new URLSearchParams;
        options.params.set('chaineComity', creditComitiesId);

        return this.http
        .get(`${HOST}/api/client/comity-montant-dossier`, options);
    }

    create(ligneRequest: LigneRequest): Observable<LigneRequest> {
        const copy = this.convert(ligneRequest);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(ligneRequest: LigneRequest): Observable<LigneRequest> {
        const copy = this.convert(ligneRequest);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<LigneRequest> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(Object.assign({}, req, { NO_QUERY: true, 'sfdId.equals': UserData.getInstance().sfdId }));
        if(!UserData.getInstance().sfdId){
             return  Observable.create((observer)=>{
            observer.error(new ResponseWrapper(null,{message:'Id SFD non renseigné'},400));
        });
        }
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => this.convertResponse(res));
    }

    getAllMyBailleur(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(Object.assign({}, req, { NO_QUERY: true, 'sfdId.equals': UserData.getInstance().sfdId }));
        if(!UserData.getInstance().sfdId){
             return  Observable.create((observer)=>{
            observer.error(new ResponseWrapper(null,{message:'Id SFD non renseigné'},400));
        });
        }
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
            .map((res: Response) => this.convertResponse(res));

    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
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
        entity.requestDate = this.dateUtils.convertLocalDateFromServer(
            entity.requestDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(ligneRequest: LigneRequest): LigneRequest {
        const copy: LigneRequest = Object.assign({}, ligneRequest);
        copy.requestDate = this.dateUtils.convertLocalDateToServer(
            ligneRequest.requestDate
        );
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            ligneRequest.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            ligneRequest.lastModifiedDate
        );
        return copy;
    }

    creditComityInLigneRequest(creditComityId: number|string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.query({'creditComitysId.equals': creditComityId.toString()})
            .subscribe(
                (r) => {
                    resolve(Array.isArray(r.json) && r.json.length > 0);
                },
                () => {
                    reject(false);
                }
            );
        });
    }
}
