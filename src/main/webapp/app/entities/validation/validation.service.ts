
import { EventBus } from '../../shared/model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';
import { Injectable } from '@angular/core';
import { Validation } from './validation.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { HOST } from '../../shared/model/request-util';
import { UserData } from '../../shared/model/singleton';
import {
    getUserRefOrChaineAgence
} from '../../shared/model/functions';

@Injectable()
export class ValidationService {
    private resourceUrl = HOST + '/api/validations';
    private resourceSearchUrl = HOST + '/api/_search/validations';
    private validationsUrl = HOST + '/api/sfd/valider-dossiers';
    private validesUrl = HOST + '/api/client/liste-dossiers-valider';
    private ficheDossierUrl = HOST + '/api/report/comity/fiche-dossier';
    private ficheDossierComityMemberUrl = HOST + '/api/report/comity/dossier-comity-membre';
    private remettreDossierEncircuitUrl = HOST + '/api/util/reinitialiser-demande-dossier';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }
    remettreDossierEncircuit(id: any) {
        const options = createRequestOption();
        options.params.set('dossier_id', id);
        return this.http
            .get(this.remettreDossierEncircuitUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }
    queryValidations(params: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('comite', params.comite);
        options.params.set('member', params.member);
        options.params.set('valide', params.valide);
        
        let params2 = getUserRefOrChaineAgence();
        options.params.set(params2[0], params2[1]);
        return this.http
            .get(this.validesUrl, options)
            .catch((res: Response) => {
                if (res.status == 401)
                    EventBus.publish('NOT_AUTHORIZED', true);
                return Observable.throw(res);
            })
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }
    createValidations(params: any): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('membre', params.membre);
        options.params.set('chainedossier', params.chainedossier);
        options.params.set('typeValide', params.typeValide);
        options.params.set('montant', params.montant);
        options.params.set('explanation', params.explanation);
        options.params.set('user_reference', UserData.getInstance().userReference);
        options.params.set('result', params.result);
        
        return this.http
            .get(this.validationsUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                return jsonResponse;
            });
    }

    create(validation: Validation): Observable<Validation> {
        const copy = this.convert(validation);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(validation: Validation): Observable<Validation> {
        const copy = this.convert(validation);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<Validation> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
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
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(validation: Validation): Validation {
        const copy: Validation = Object.assign({}, validation);
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            validation.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            validation.lastModifiedDate
        );
        return copy;
    }

    showFicheDossier(id: number): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('dossier_id', '' + id);
        
        return this.http.get(this.ficheDossierUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
            return res.json();
        });
    }

    showFicheDossierComityMember(id: number): Observable<any> {
        const options = createRequestOption();
        
        options.params.set('dossier_id', '' + id);
        
        return this.http.get(this.ficheDossierComityMemberUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {

            return res.json();
        });
    }
}
